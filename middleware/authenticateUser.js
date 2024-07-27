const { json } = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next)=>{
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];
      console.log(req.headers)
   if(!token){
    return res.status(401),json({message:"unauthorized- missing token"}); 
   }

   jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded)=>{
        if(err) return res.status(403).json({ message: 'Forbidden - Invalid token' });
        res.users = decoded;

        next()
   })
}

module.exports = verifyJWT;