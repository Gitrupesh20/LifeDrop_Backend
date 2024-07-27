const { handleLogOut } = require("../controllers/logOutController");


const router = require("express").Router();

router.get("/", handleLogOut)

module.exports = router;