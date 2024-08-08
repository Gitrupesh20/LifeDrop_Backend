require("dotenv").config();
const express = require("express");
const http = require("http");
const { logger } = require("./middleware/logEvent");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const { crosOptions } = require("./config/cros");
const authenticateUser = require("./middleware/authenticateUser");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");
const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

connectDB();
//app.use(logger);
app.use(credentials);
app.use(cors(crosOptions)); // cors = cross origin resource sharing
//format the form data as it as
app.use(express.urlencoded({ extended: false }));
//convert incoming data in url into json
app.use(express.json());
app.use(cookieParser());
//mount routes

app.use("/appUsers/signup", require("./routes/appUsers/signup"));

app.use("/appUsers/signin", require("./routes/appUsers/signIn"));

app.use("/donors/register", require("./routes/donors/register"));

app.use("/confirm", require("./routes/EmailVarification"));

app.use(
  "/bloodRequests/find-donor",
  require("./routes/bloodRequests/findDonor")
);

app.use(authenticateUser); //jwt token to verify user
console.log("Authenticated");

app.use(
  "/bloodRequests/request",
  require("./routes/bloodRequests/sendBloodRequest")
);
app.use(
  "/donations/requests/status",
  require("./routes/appUsers/donationRequestStatus")
);

app.use("/donors/requests", require("./routes/donors/donationRequest"));

app.use("/notification", require("./routes/appUsers/notifications"));

app.use("/accept-request", require("./routes/donors/acceptRequest"));

app.use("/decline-request", require("./routes/donors/declineRequest"));

app.use(
  "/update-profile",
  require("./routes/appUsers/update/updateProfileInfo")
);

app.use("/update-password", require("./routes/appUsers/update/updatePassword"));

app.use("/update-address", require("./routes/appUsers/update/updateAddress"));

app.use("/update-status", require("./routes/appUsers/update/updateStatus"));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

//error handler middelware
app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("Connected ot MongoDB");

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
