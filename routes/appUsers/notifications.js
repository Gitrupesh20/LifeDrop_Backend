const express = require("express");
const Notification = require("../../model/Notification");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.userID) {
    return res.status(401).json({ message: "Invalid request" });
  }

  try {
    // Find all notifications for the user
    const notificationList = await Notification.find({
      userId: req.userID,
    });

    let New = false;
    const list = [];
    // Mark notifications as read and push in list
    for (const item of notificationList) {
      list.push({
        message: item.message,
        isRead: item.isRead,
      });
      if (!item.isRead) {
        New = true;
      }
      item.isRead = true;
      await item.save();
    }

    res.status(200).json({ list: list, isNew: New });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
