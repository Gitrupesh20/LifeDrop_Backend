const bcrypt = require("bcrypt");
const path = require("path");
const fsPromise = require("fs").promises;
const roles = require("../../config/roles");

const { sendVerificationEmail } = require("../../config/mailer");
const { generateToken } = require("../appUsersControllers/registerUser");
const donors = {
  donor: require("../../model/donor.json"),
  setDonor: function (donor) {
    this.donor = donor;
  },
};
const users = {
  data: require("../../model/users.json"),
  setUser: function (data) {
    this.data = data;
  },
};
const VerificationToken = {
  data: require("../../model/verificationToken.json"),
  setData: function (data) {
    this.data = data;
  },
};

const handleNewDonor = async (req, res) => {
  if (!req?.body) {
    return res.status(400).json({ message: "req body should not be empty" });
  }
  console.log(req.body);
  const { appUserDTO, donorDTO } = req.body;
  console.log(`app ${appUserDTO}`);
  console.log(`donor ${donorDTO}`);
  const { password, username } = appUserDTO;
  try {
    const isAppUserExist = users.data.find((obj) => obj.username === username);
    //check for duplicate
    console.log("isAppUserExist");
    console.log(isAppUserExist);
    const isDonorExist = donors.donor.find((obj) => obj.username === username);

    if (isDonorExist) {
      return res.status(409).json({ message: "user already exists" });
    }

    if (isAppUserExist) {
      const match = await bcrypt.compare(password, isAppUserExist.password);
      console.log(`user exits${match}`);
      if (!match) return res.status(401).json({ message: "Wrong Password" });
    }

    //encrypt password
    console.log("password");

    const hashedPwd = isAppUserExist
      ? isAppUserExist.password
      : await bcrypt.hash(password, 10);
    console.log(hashedPwd);
    const otherUser = users.data.filter((item) => item.username !== username);
    const otherDonor = users.data.filter((item) => item.username !== username);

    const currentUser = {
      ...appUserDTO,
      password: hashedPwd,
      isVerified: isAppUserExist.isVerified,
      role: { user: roles.user, donor: roles.donor },
    };
    const currentDonor = { ...donorDTO, username: username };

    users.setUser([...otherUser, currentUser]);
    donors.setDonor([...otherDonor, currentDonor]);

    if (!isAppUserExist) {
      const token = generateToken();
      await sendVerificationEmail(
        { username, firstName: appUserDTO.firstName },
        token
      );

      VerificationToken.setData([
        ...VerificationToken.data,
        { username: username, token: token },
      ]);

      await fsPromise.writeFile(
        path.join(__dirname, "..", "..", "model", "verificationToken.json"),
        JSON.stringify(VerificationToken.data)
      );
    }

    await fsPromise.writeFile(
      path.join(__dirname, "..", "..", "model", "users.json"),
      JSON.stringify(users.data)
    );
    console.log(users.data);
    console.log(donors.donor);

    await fsPromise.writeFile(
      path.join(__dirname, "..", "..", "model", "donor.json"),
      JSON.stringify(donors.donor)
    );
    res
      .status(200)
      .json({ message: `new user ${username} registered successfully` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewDonor };
