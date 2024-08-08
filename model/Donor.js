const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const User = require("./Users");
const DonorSchema = new Schema(
  {
    AvalibilityStatus: { type: Boolean, default: true },
    bloodGroup: { type: String, required: true, maxLength: 5 },
    streetAddress: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String },
    pincode: { type: String },
    lastDonationDate: { type: String, required: true },
    id: { type: String, required: true, unique: true }, // Add this line
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donor", DonorSchema);
