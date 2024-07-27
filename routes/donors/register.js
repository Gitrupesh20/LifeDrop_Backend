const { handleNewDonor } = require("../../controllers/donorsControllers");

const router = require("express").Router();


router.post("/",handleNewDonor);

module.exports =  router;