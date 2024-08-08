const { donor } = require("../../config/roles");
const Donor = require("../../model/Donor");
const Request = require("../../model/Request");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const userId = req?.userID;

    const donors = await Request.find(
      { recipientID: userId },
      "status requestedDate donorID"
    );
    const statusInfo = await Promise.all(
      //find donor and retrive info
      donors.map(async (item) => {
        const donorInfo = await Donor.findOne(
          { id: item.donorID },
          "bloodGroup"
        )
          .populate("user", "firstName lastName gender")
          .exec();
        return {
          donorName: `${donorInfo?.user?.firstName} ${donorInfo?.user?.lastName}`,
          bloodGroup: donorInfo?.bloodGroup,
          gender: donorInfo?.user?.gender,
          status: item?.status,
          reqDate: new Date(item?.requestedDate).toLocaleDateString("us-en", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }),
        };
      })
    );
    //console.log(statusInfo);
    res.status(200).json(statusInfo);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
