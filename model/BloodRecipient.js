const Donor = require("./Donor");
const User = require("./Users");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BloodRecipientSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true, maxLength: 20 },
    requiredBloodGroup: { type: String, required: true, maxLength: 5 },
    phoneNumber: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: String, required: true },
    unitsRequired: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    governmentId: { type: String, required: true },
    donors: [{ type: String, ref: "Donor" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("bloodRecipients", BloodRecipientSchema);

/* 
{
  patientName: 'Ramu',
  requiredBloodGroup: 'A+',
  whatsapp: '8920144545',
  gender: 'Female',
  age: '56',
  unitsRequired: '2',
  streetAddress: 'B block  Gali no 22 H NO 624  Sant nagar Burari',
  city: 'Papum Pare',
  governmentId: '112222222222',
  donors: [ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6f' ],
  state: 'Arunachal Pradesh'
}
   */
