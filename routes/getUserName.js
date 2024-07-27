
const router = require("express").Router();
const users = {
    data:require("../model/users.json"),
    setUser : function(data){this.data = data}
};
router.get("/",(req, res, next)=>{
    //console.log(res.users)
    const user = users.data.find((item)=>item.userID === res.users.userID);
    
     //console.log(user.username)
    if(user === undefined){
        return res.status(204).json({message:"user not found"});
    }

    res.status(200).json({ username: user.username , Name:user.name});
    
});

module.exports = router;