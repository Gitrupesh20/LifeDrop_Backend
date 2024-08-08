const bcrypt = require("bcrypt");
const crypto = require("crypto");
const roles = require("../../config/roles");
const { sendVerificationEmail } = require("../../config/mailer");
const User = require("../../model/Users");

function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

const handleNewUser = async (req, res) => {
  if (!req?.body) {
    return res.status(400).json({ message: "req body should not be empty" });
  }

  // console.log(users.data);
  const userDetails = req.body;
  if (!userDetails) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    //console.log(userDetails);
    //check for duplicate
    const isExist = await User.findOne({
      username: userDetails.username,
    }).exec();
    if (isExist)
      return res.status(409).json({ message: `user already exists ` });

    //encrypt password
    const hashedPwd = await bcrypt.hash(userDetails.password, 10);
    const token = generateToken();

    const resutl = await User.create({
      ...userDetails,
      password: hashedPwd,
      verificationToken: token,
    });
    console.log(resutl);

    // generate token for email varification
    const { username, firstName } = userDetails;

    await sendVerificationEmail({ username, firstName }, token);

    res
      .status(200)
      .json({ message: `new user ${username} registered successfully` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
  generateToken,
};
