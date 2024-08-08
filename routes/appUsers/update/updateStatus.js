const Donor = require("../../../model/Donor");
const router = require("express").Router();

router.put("/", async (req, res) => {
  const newStatus = req?.body;

  if (!req.body || !newStatus)
    return res.status(400).json({ message: "Bad Request" });

  try {
    const updateDonor = await Donor.findOneAndUpdate(
      { user: req.userID },
      {
        AvalibilityStatus: newStatus.checkedStatus,
        lastDonationDate: newStatus.newLastDonationDate,
      },
      { new: true }
    ).exec();

    if (!updateDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json({
      message: "Status Update successful",
      lastDonationDate: new Date(updateDonor.lastDonationDate).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ),

      status: updateDonor.AvalibilityStatus,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Error" });
  }
});

module.exports = router;
