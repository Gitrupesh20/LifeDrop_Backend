const refreshTokenController = require("../controllers/refreshTokenController");
const router = require("express").Router();

router.get("/",refreshTokenController.handleRefreshToken);

module.exports = router;