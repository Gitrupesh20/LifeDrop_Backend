const bcrypt = require("bcrypt");
const Donor = require("../../model/Donor");
const jwt = require("jsonwebtoken");
const Users = require("../../model/Users");

function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

const handleLogIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "invalid logIn" });

  try {
    const foundUser = await Users.findOne({ username: username }).exec();

    if (!foundUser || !foundUser.isEmailVerified)
      return res.status(404).json({ message: "invalid Username" });

    //decode password
    const match = await bcrypt.compare(password, foundUser.password);
    //console.log(`match res ${match}`);
    if (match) {
      const roles = Object.values(foundUser.role);
      // create-jwt-accessToken

      const accessToken = jwt.sign(
        {
          username: foundUser.username,
          roles: roles,
          userID: foundUser._id,
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1d",
        }
      );

      const donorDetails = await Donor.findOne({ user: foundUser._id }).exec();

      const user = {
        name: foundUser.firstName + " " + foundUser.lastName,
        DOB: foundUser.dateOfBirth,
        email: foundUser.username,
        age: calculateAge(foundUser.dateOfBirth),
        mobile: foundUser.phoneNumber,
        gender: foundUser.gender,
        bloodGroup: donorDetails?.bloodGroup,
        address: [
          donorDetails?.streetAddress,
          donorDetails?.city,
          donorDetails?.state,
          donorDetails?.pincode,
        ]
          .filter((part) => part != null && part.trim() !== "")
          .join(" "),
        LDDs: donorDetails?.lastDonationDate,
        AvalibilityStatus: donorDetails?.AvalibilityStatus,
      };
      console.log("log in");
      res
        .status(200)
        .json({ message: "login successful", AccessToken: accessToken, user });
    } else {
      console.log("in not match");
      res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err.message });
  }
};

module.exports = { handleLogIn, calculateAge };
