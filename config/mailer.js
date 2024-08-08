const nodemailer = require("nodemailer");
const { content, confirmMailTemplate } = require("./emailTemplate");
require("dotenv").config();

// Create transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  // secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// create function that will send mail
const sendVerificationEmail = async (user, token) => {
  const verificationLink = `http://localhost:3000/registration/verification/${token}`;

  //console.log(user);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.username,
    subject: "Email Verification",
    html: content({ name: user.firstName, verificationLink }),
  };

  //console.log("EMAIL_USER:", process.env.EMAIL_USER);
  //console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  console.log("Attempting to send email");

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return;
  } catch (error) {
    console.error("Error in test email sending:", error);
    throw error;
  }
};

// create function that will send mail
const sendBloodReqAcceptanceEmail = async (DonorDetails) => {
  //console.log(DonorDetails);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: DonorDetails.recipientEmail,
    subject: "Blood Request Acceptance",
    html: confirmMailTemplate(DonorDetails),
  };

  //console.log("EMAIL_USER:", process.env.EMAIL_USER);
  //console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

  console.log("Attempting to send email");

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return;
  } catch (error) {
    console.error("Error in test email sending:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendBloodReqAcceptanceEmail,
};
