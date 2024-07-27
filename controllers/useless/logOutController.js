const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromise = require("fs").promises;
const path = require("path");
const users = {
    data:require("../model/users.json"),
    setUser : function(data){this.data = data}
};
const handleLogOut = async(req, res)=>{
   try{ 
    const cookies = req.cookies;
        if(!cookies?.jwt){
            return res.sendStatus(204);// no content
        }
        console.log(cookies.jwt);
        const refreshToken = cookies.jwt;
        const foundUser = users.data.find(item=>item.refreshToken === refreshToken);
        if(!foundUser){
            res.clearCookie("jwt", {httpOnly:true, sameSite:"None"}) //clear cookie
            return res.sendStatus(403);
        } 

        //delete cookie
        const otherUser = users.data.filter(user=>user.refreshToken !== refreshToken);
        const currentUser = {...foundUser, refreshToken:""};
        users.setUser([...otherUser, currentUser]);
        await fsPromise.writeFile(
            path.join(__dirname,"..","model", "users.json"),
            JSON.stringify(users.data)
        )
        res.clearCookie("jwt",{httpOnly:true, sameSite:"None"}) // set secure true only for https
        console.log("log out")
        res.sendStatus(204);
           
    }catch(err){
        res.status(500).json({"Error":err.message});
    }
}

module.exports ={ handleLogOut };