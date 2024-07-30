const bcrypt = require("bcrypt");
const path = require("path");
const fsPromise = require("fs").promises;
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const users = {
  data: require("../../model/users.json"),
  setUser: function (data) {
    this.data = data;
  },
};
const Donors = {
  Donor: require("../../model/donor.json"),
  setDonor: function (data) {
    this.data = data;
  },
};

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
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.log(password);
      return res.status(400).json({ message: "invalid logIn" });
    }
    console.log(password);
    const foundUser = users.data.find((item) => item.username === username);

    if (!foundUser || !foundUser.isVerified) {
      console.log(foundUser);
      return res.status(404).json({ message: "invalid Username" });
    }
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
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "40s",
        }
      );
      /*
      const refreshToken = jwt.sign(
                    {"username": foundUser.username, "userID" : foundUser.userID},
                    process.env.REFRESH_TOKEN,
                    {expiresIn:"1d"}
                ); */
      /*   const otherUser = users.data.filter(user=>user.username !== foundUser.username);
                    const currentUser = {...foundUser, refreshToken};
                    users.setUser([...otherUser,currentUser]);
                    
                    await fsPromises.writeFile(
                        path.join(__dirname,"..","model","users.json"),
                        JSON.stringify(users.data)
                    ); 
                */
      console.log("log in ");
      const donorDetails = Donors.Donor.find(
        (donor) => donor.username === foundUser.username
      );
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
      };
      //console.log(user);
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

module.exports = { handleLogIn };
