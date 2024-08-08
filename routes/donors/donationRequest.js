const Donor = require("../../model/Donor");
const Request = require("../../model/Request");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.userID }).exec();

    const recipientList = await Request.find(
      { donorID: donor.id, status: "Pending" },
      "status recipientID requestedDate _id"
    ).populate(
      "bloodRecipientID",
      "patientName streetAddress city age gender unitsRequired phoneNumber requiredBloodGroup"
    );
    res.status(200).json(recipientList);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

module.exports = router;
/* {
    patientName: "Alice Johnson",
    streetAddress: "789 Oak St",
    city: "Capital City",
    age: 27,
    gender: "Female",
    unitsRequired: 1,
    whatsapp: "555-555-5555",
    requiredBloodGroup: "O+",
  }, */
