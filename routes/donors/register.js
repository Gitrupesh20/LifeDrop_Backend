const {
  handleNewDonor,
} = require("../../controllers/donorControllers/registerDonor");

const router = require("express").Router();

router.post("/", handleNewDonor);

module.exports = router;
