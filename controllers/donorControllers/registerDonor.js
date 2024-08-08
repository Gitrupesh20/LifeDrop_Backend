const bcrypt = require("bcrypt");
const roles = require("../../config/roles");
const User = require("../../model/Users");
const Donor = require("../../model/Donor");
const { sendVerificationEmail } = require("../../config/mailer");
const { generateToken } = require("../appUsersControllers/registerUser");
const { v4: uuidv4 } = require("uuid");
const handleNewDonor = async (req, res) => {
  if (!req?.body)
    return res.status(400).json({ message: "req body should not be empty" });

  const { appUserDTO, donorDTO } = req.body;

  const { password, username, firstName } = appUserDTO;
  try {
    const foundUser = await User.findOne({ username: username });
    //check for duplicate
    const isDonorExist = await Donor.findOne({ user: foundUser?._id });

    if (isDonorExist)
      return res.status(409).json({ message: "user already exists" });

    if (foundUser) {
      const match = await bcrypt.compare(password, foundUser.password);

      if (!match) return res.status(401).json({ message: "Wrong Password" });

      foundUser.role = { ...foundUser.role, donor: roles.donor };
      await foundUser.save();
      const DonorResult = await Donor.create({
        ...donorDTO,
        user: foundUser._id,
        id: uuidv4(),
      });

      if (!foundUser.isEmailVerified)
        return res.status(209).json({ message: "Try again latter" });
    } else {
      const token = generateToken();

      //encrypt password
      const hashedPwd = await bcrypt.hash(password, 10);
      const user = await User.create({
        ...appUserDTO,
        password: hashedPwd,
        verificationToken: token,
        role: { donor: roles.donor },
      });

      const donor = await Donor.create({
        user: user._id,
        ...donorDTO,
        id: uuidv4(),
      });

      await sendVerificationEmail({ username, firstName }, token);
      console.log("email sended");
    }

    res
      .status(200)
      .json({ message: `new user ${username} registered successfully` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewDonor };
