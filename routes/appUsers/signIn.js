const express = require("express");
const { handleLogIn } = require("../../controllers/appUsersControllers");
const router = express.Router();



router.post("/",handleLogIn);

module.exports =  router;