const router = require("express").Router();
const bloodRecipients = require("../../model/BloodRecipient");
const Request = require("../../model/Request");
const notification = require("../../model/Notification");
const Donor = require("../../model/Donor");
router.post("/", async (req, res) => {
  if (!req.body)
    return res.status(400).json({ message: "Body should not be empty" });

  const patientDetails = req.body;

  try {
    const saveBloodRecipient = await bloodRecipients.create({
      ...patientDetails,
      userID: req.userID,
    });

    if (patientDetails?.donors) {
      for (const id of patientDetails?.donors) {
        // store request record in request tables
        const requestRes = await Request.create({
          donorID: id,
          recipientID: req.userID,
          bloodRecipientID: saveBloodRecipient._id,
        });

        // find donor to send notfication
        const donor = await Donor.findOne({ id: id })
          .populate("user", "_id")
          .exec();
        if (!donor || !donor.user) {
          throw new Error(
            `Donor with id ${id} not found or has no associated user`
          );
        }
        const notificationMessage = `${patientDetails.patientName} Needs Blood`;
        const notifyRes = await notification.create({
          userId: donor.user?._id,
          message: notificationMessage,
        });
      }

      console.log("request posted");
      res.status(200).json({ message: "Blood Request Posted Successfully" });
    } else {
      const { requiredBloodGroup, state } = patientDetails;

      const donorList = await Donor.find(
        { bloodGroup: requiredBloodGroup, state: state },
        "id"
      )
        .populate("user", "_id")
        .exec();
      if (!donorList || donorList.length === 0) {
        return res.status(404).json({
          message: `Sorry, there are no '${requiredBloodGroup}' donors in your state.`,
        });
      }
      const result = await Promise.all(
        donorList.map(async (donor) => {
          await Request.create({
            donorID: donor.id,
            recipientID: req.userID,
            bloodRecipientID: saveBloodRecipient._id,
          });

          const notificationMessage = `${patientDetails.patientName} Needs Blood`;
          const notifyRes = await notification.create({
            userId: donor.user?._id,
            message: notificationMessage,
          });
        })
      );

      res.status(200).json({ message: "Blood Request Posted Successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
