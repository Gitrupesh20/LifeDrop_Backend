const bloodRecipients = require("./BloodRecipient");
const Donor = require("./Donor");
const mongoose = require("mongoose");
const User = require("./Users");

const Schema = mongoose.Schema;

const RequestSchema = new Schema(
  {
    donorID: { type: String, ref: "Donor", required: true },
    recipientID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bloodRecipientID: {
      type: Schema.Types.ObjectId,
      ref: "bloodRecipients",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    requestedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
