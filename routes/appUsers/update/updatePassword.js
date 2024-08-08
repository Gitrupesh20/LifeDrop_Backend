const User = require("../../../model/Users");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.put("/", async (req, res) => {
  if (!req.body || !req.body.oldPass || !req.body.newPass) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const { oldPass, newPass } = req.body;

  try {
    const user = await User.findById(req.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(oldPass, user.password);

    if (match) {
      const hashPwd = await bcrypt.hash(newPass, 10);
      user.password = hashPwd;

      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    } else {
      return res.status(401).json({ message: "Wrong Password" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
