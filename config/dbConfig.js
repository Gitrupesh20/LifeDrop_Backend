const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = connectDB;
