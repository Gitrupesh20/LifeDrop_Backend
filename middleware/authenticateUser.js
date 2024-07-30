const { json } = require("express");
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  //console.log(req.headers);
  if (!token) {
    return res.status(401), json({ message: "unauthorized- missing token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    //atteched username and role in req
    (req.user = decoded.username), (req.roles = decoded.roles);
    //console.log(req);
    next();
  });
};

module.exports = verifyJWT;
