const express = require("express");
const {
  handleNewUser,
} = require("../../controllers/appUsersControllers/registerUser");
const router = express.Router();

router.post("/", handleNewUser);

module.exports = router;
