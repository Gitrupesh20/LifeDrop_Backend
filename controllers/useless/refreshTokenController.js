const jwt = require("jsonwebtoken");
require("dotenv").config();

const users = {
    data:require("../model/users.json"),
    setUser : function(data){this.data = data}
};
const handleRefreshToken = (req, res)=>{
   try{ 
    const cookies = req.cookies;
        console.log(cookies)
        if(!cookies?.jwt){
            return res.sendStatus(403);
        }
        
        const refreshToken = cookies.jwt;
        const foundUser = users.data.find(item=>item.refreshToken === refreshToken);
        if(!foundUser) return res.status(403).json({"massage":"invalid Rtoken","foundUser":foundUser});

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN,
            (err, decoded)=>{
                if(err /* || foundUser.username !== decoded.username */) return res.status(403).json({massage:err.message});
                
                const accessToken = jwt.sign(
                    {"username":foundUser.username},
                    process.env.ACCESS_TOKEN,
                    {expiresIn:"30s"}
                );

                res.json({accessToken});
        })
           
    }catch(err){
        res.status(500).json({"Error":err.message});
    }
}

module.exports ={ handleRefreshToken}