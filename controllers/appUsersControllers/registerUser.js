const bcrypt = require("bcrypt");
const path = require("path");
const fsPromise = require("fs").promises;
const roles = require("../../config/roles");
const { sendVerificationEmail } = require("../../config/mailer");
const crypto = require("crypto");

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

function generateToken() {
  return crypto.randomBytes(20).toString("hex");
}

const handleNewUser = async (req, res) => {
  if (!req?.body) {
    return res.status(400).json({ message: "req body should not be empty" });
  }

  console.log(users.data);
  const userDetails = req.body;
  if (!userDetails) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    console.log(userDetails);
    //check for duplicate
    const isExist = users.data.find(
      (item) => item.username === userDetails.username
    );
    if (isExist) {
      return res.status(409).json({ message: `user already exists ` });
    }

    //encrypt password
    const hashedPwd = await bcrypt.hash(userDetails.password, 10);

    const newUser = {
      ...userDetails,
      role: { user: roles.user },
      isVerified: false,
      password: hashedPwd,
    };
    users.setUser([...users.data, newUser]);

    // generate token for email varification
    const { username, firstName } = userDetails;
    const token = generateToken();
    await sendVerificationEmail({ username, firstName }, token);

    VerificationToken.setData([
      ...VerificationToken.data,
      { username: username, token: token },
    ]);

    await fsPromise.writeFile(
      path.join(__dirname, "..", "..", "model", "verificationToken.json"),
      JSON.stringify(VerificationToken.data)
    );
    await fsPromise.writeFile(
      path.join(__dirname, "..", "..", "model", "users.json"),
      JSON.stringify(users.data)
    );
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
