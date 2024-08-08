const { sendBloodReqAcceptanceEmail } = require("../../config/mailer");
const { calculateAge } = require("../../controllers/appUsersControllers/auth");
const Donor = require("../../model/Donor");
const Notification = require("../../model/Notification");
const Request = require("../../model/Request");

const router = require("express").Router();

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400);

  const { id } = req.body;

  try {
    const query = { _id: id };
    const bloodReqInfo = await Request.findOneAndUpdate(
      query,
      {
        status: "Accepted",
      },
      { select: "donorID" },
      { new: true }
    )
      .populate("recipientID", "_id firstName lastName username")
      .populate("bloodRecipientID", "_id");

    const donorID = bloodReqInfo.donorID;
    const recipientID = bloodReqInfo.recipientID._id;

    const donor = await Donor.findOne(
      { id: donorID },
      "bloodGroup streetAddress state city pincode"
    )
      .populate(
        "user",
        "firstName lastName phoneNumber username dateOfBirth gender"
      )
      .exec();
    //console.log(donor);
    const nonAcceptedReq = await Request.deleteMany({
      bloodRecipientID: bloodReqInfo.bloodRecipientID._id,
      status: "Pending",
    }).exec();
    // console.log(nonAcceptedReq);

    const notificationMessage = `${donor.user?.firstName} Accept your Request`;

    const notify = await Notification.create({
      userId: recipientID,
      message: notificationMessage,
    });

    const DonorDetails = {
      recipientName:
        bloodReqInfo.recipientID.firstName +
        " " +
        bloodReqInfo.recipientID.lastName,
      recipientEmail: bloodReqInfo.recipientID.username,
      name: donor.user.firstName + " " + donor.user.lastName,
      bloodGroup: donor.bloodGroup,
      age: calculateAge(donor.user.dateOfBirth),
      phoneNumber: donor.user.phoneNumber,
      Email: donor.user.username,
      address: [donor?.streetAddress, donor?.city, donor?.state, donor?.pincode]
        .filter((part) => part != null && part.trim() !== "")
        .join(" "),
    };

    sendBloodReqAcceptanceEmail(DonorDetails);
    console.log("mail sended");
    console.log("Accepted");

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
