const Donor = require("../../model/Donor");
const Notification = require("../../model/Notification");
const Request = require("../../model/Request");

const router = require("express").Router();

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400);

  const { id } = req.body;
  console.log(id);
  try {
    const query = { _id: id };
    const bloodReqInfo = await Request.findOneAndUpdate(
      query,
      {
        status: "Rejected",
      },
      { select: "donorID" },
      { new: true }
    ).populate("recipientID", "_id");

    const donorID = bloodReqInfo.donorID;
    const recipientID = bloodReqInfo.recipientID._id;

    const donor = await Donor.findOne({ id: donorID })
      .populate("user", "firstName")
      .exec();

    const notificationMessage = `${donor.user?.firstName} rejecte your Request`;

    const notify = await Notification.create({
      userId: recipientID,
      message: notificationMessage,
    });
    console.log("Rejected");
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
