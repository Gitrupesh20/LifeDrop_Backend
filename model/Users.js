const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, maxLength: 100 },
    lastName: { type: String, required: true, maxLength: 100 },
    gender: { type: String, required: true, maxLength: 10 },
    dateOfBirth: { type: Date },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    role: {
      user: { type: Number, default: 1729 },
      donor: { type: Number },
      admin: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
