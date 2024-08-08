const { donor, user } = require("../../../config/roles");
const {
  calculateAge,
} = require("../../../controllers/appUsersControllers/auth");
const Donor = require("../../../model/Donor");
const User = require("../../../model/Users");
const router = require("express").Router();

router.put("/", async (req, res) => {
  if (!req.body) return res.status(400).json({ message: "Bad Request" });
  const details = req.body;
  console.log(details);

  try {
    const newDetails = {
      firstName: details.firstName,
      lastName: details.lastName,
      gender: details.gender,
      dateOfBirth: details.dateOfBirth,
      phoneNumber: details.phoneNumber,
      username: details.Email,
    };
    console.log(req.userID);
    const updatedUser = await User.findByIdAndUpdate(req.userID, newDetails, {
      new: true,
    }).exec();

    const updateDonor = await Donor.findOneAndUpdate(
      { user: updatedUser._id },
      { bloodGroup: details.bloodGroup },
      { new: true }
    ).exec();

    if (!updateDonor || !updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedDetails = {
      name: newDetails.firstName + " " + newDetails.lastName,
      DOB: new Date(newDetails.dateOfBirth).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
      }),
      email: newDetails.username,
      age: calculateAge(newDetails.dateOfBirth),
      mobile: newDetails.phoneNumber,
      gender: newDetails.gender,
      bloodGroup: details?.bloodGroup,
      AvalibilityStatus: updateDonor.AvalibilityStatus,
      address: [
        updateDonor?.streetAddress,
        updateDonor?.city,
        updateDonor?.state,
        updateDonor?.pincode,
      ]
        .filter((part) => part != null && part.trim() !== "")
        .join(" "),
      LDDs: new Date(updateDonor?.lastDonationDate).toLocaleString("us-en", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    };
    res
      .status(200)
      .json({ message: "Profile Details Updated", updatedDetails });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
