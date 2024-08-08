const Donor = require("../../../model/Donor");
const router = require("express").Router();

router.put("/", async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Bad Request" });
  }

  const newAddress = req.body;

  try {
    const updateDonor = await Donor.findOneAndUpdate(
      { user: req.userID },
      newAddress,
      { new: true }
    ).exec();

    if (!updateDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    console.log(updateDonor);

    res.status(200).json({
      message: "Update successful",
      updatedAddress: `${updateDonor.streetAddress} ${updateDonor.city} ${updateDonor.state} ${updateDonor.pincode}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
