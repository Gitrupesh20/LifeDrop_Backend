const Users = require("../model/Users");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const { token } = req.query;

  try {
    console.log("verifying email");
    const user = await Users.findOne({
      verificationToken: token,
    }).exec();

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (user.isEmailVerified) {
      return res.status(400).send("email already verify");
    }

    // Update the user's verification status

    user.isEmailVerified = true;
    user.verificationToken = null; // Remove the token
    await user.save();

    console.log("mail verified...");
    res.status(200).json("confirmed");
  } catch (err) {
    console.error(err);
    res.status(400).json("not confiremed  }");
  }
});

module.exports = router;
