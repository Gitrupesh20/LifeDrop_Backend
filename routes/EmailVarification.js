const router = require("express").Router();
const path = require("path");
const fsPromise = require("fs").promises;

const VerificationToken = {
  data: require("../model/verificationToken.json"),
  setData: function (data) {
    this.data = data;
  },
};
const users = {
  data: require("../model/users.json"),
  setUser: function (data) {
    this.data = data;
  },
};

router.get("/", async (req, res) => {
  const { token } = req.query;

  try {
    console.log("verifying email");
    const isValidToken = VerificationToken.data.find(
      (item) => item.token === token
    );

    if (!isValidToken) {
      return res.status(400).send("Invalid or expired token");
    }

    // Find the user with the token match
    const userIndex = users.data.findIndex(
      (item) => item.username === isValidToken.username
    );

    if (userIndex === -1) {
      return res.status(400).send("User not found");
    }

    // Update the user's verification status
    users.data[userIndex].isVerified = true;

    // Delete the  token from the verification table / json file
    VerificationToken.setData(
      VerificationToken.data.filter((item) => item.token !== token)
    );

    await fsPromise.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(users.data)
    );

    await fsPromise.writeFile(
      path.join(__dirname, "..", "model", "verificationToken.json"),
      JSON.stringify(VerificationToken.data)
    );
    console.log("mail verified...");
    res.status(200).json("confirmed");
  } catch (err) {
    throw err;
    res.status(400).json("not confiremed  }");
  }
});

module.exports = router;
