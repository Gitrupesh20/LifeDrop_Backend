require("dotenv").config();
const express = require("express");
const http = require("http");
const { logger } = require("./middleware/logEvent");
const cors = require("cors");
const { error } = require("console");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const { crosOptions } = require("./config/cros");
const authenticateUser = require("./middleware/authenticateUser");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

//app.use(logger);
app.use(credentials);
app.use(cors(crosOptions)); // cors = cross origin resource sharing
//format the form data as it as
app.use(express.urlencoded({ extended: false }));
//convert incoming data in url into json
app.use(express.json());
app.use(cookieParser());
//mount routes

/* app.use("/", (req, res, next) => {
    if (req.path === "/") {
    } else {
        next();
    }
});
 */
app.use("/appUsers/signup", require("./routes/appUsers/signup"));

app.use("/appUsers/signin", require("./routes/appUsers/signIn"));

app.use("/donors/register", require("./routes/donors/register"));

app.use("/confirm", require("./routes/EmailVarification"));

app.use(authenticateUser); //jwt token to verify user

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

//error handler middelware
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
