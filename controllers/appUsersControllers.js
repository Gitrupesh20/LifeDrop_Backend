
const handleLogIn = async(req, res)=>{

    try{ 
        const {username, password} = req.body;
            if(!username || !password){
                console.log(username, password);
                return res.status(400).json({"massage":"invalid logIn"});
            }
            
            const foundUser = users.data.find(item=>item.username === username);
            if(!foundUser) return res.status(404).json({"massage":"invalid Username"});
            const match = bcrypt.compare(password , foundUser.password);
    
            if(match){
                //jwt 
                const accessToken = jwt.sign(
                    {"username":foundUser.username, "userID" : foundUser.userID},
                    process.env.ACCESS_TOKEN,
                    {expiresIn: '40s'}
                );
                /*const refreshToken = jwt.sign(
                    {"username": foundUser.username, "userID" : foundUser.userID},
                    process.env.REFRESH_TOKEN,
                    {expiresIn:"1d"}
                ); */
                const otherUser = users.data.filter(user=>user.username !== foundUser.username);
                const currentUser = {...foundUser, refreshToken};
                users.setUser([...otherUser,currentUser]);
                
                await fsPromises.writeFile(
                    path.join(__dirname,"..","model","users.json"),
                    JSON.stringify(users.data)
                );
                console.log("log in ")
                //res.cookie("jwt", refreshToken, {httpOnly: true, sameSite:"None",  maxAge: 24*60*60*1000 });  // 24* 60* *60*1000 it is one day // sucure: true on;y for https
                res.status(200).json({"massage":"login successful","AccessToken": accessToken,username:foundUser.username,"userID":foundUser.userID});
    
            }else{
                 res.status(401).json({"massage":"Wrong password"});
    
            }
        }catch(err){
            res.status(500).json({"Error":err.message});
        }
};



const handleNewUser = async(req, res) => {

    if(!req?.body){

        return res.status(400).json({message:"req body should not be empty"})

    }
    console.log(req.body)
    const { firstName, lastName, dateOfBirth, gender, username, password} = req.body;
    try {    
    //check for duplicate
    const isExist = users.data.find(item => item.username === username);
    if (isExist) {
        return res.status(409).json({ "message": "user already exists" });
    }

        //encrypt password
        const hashedPwd = await bcrypt.hash(password, 10);
        const newUser = {
            "firstName" : firstName,
            "lastName" : lastName,
            "username": username,
            "password": hashedPwd,
            "DOB"  : dateOfBirth,
            "gender" : gender,
        };
        users.setUser([...users.data, newUser]);
        await fsPromise.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(users.data),
        );
        res.status(200).json({ "message": `new user ${username} registered successfully` });
    } catch (err) {
        return res.status(500).json({ "message": err.message });
    }

};

module.exports = {
    handleLogIn,
    handleNewUser,
}