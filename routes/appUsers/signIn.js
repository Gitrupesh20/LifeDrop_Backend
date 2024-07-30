const express = require("express");
const { handleLogIn } = require("../../controllers/appUsersControllers/auth");

const router = express.Router();

router.post("/", handleLogIn);

module.exports = router;
