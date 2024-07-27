const handleNewDonor = async(req, res) => {

    if(!req?.body){

        return res.status(400).json({message:"req body should not be empty"})

    }
    console.log(req.body)
    const { firstName, lastName, dateOfBirth,bloodGroup, whatsAppNumber, lastDonationDate,  gender, username, password} = req.body;
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
            "bloodGroup" : bloodGroup,
            "whatsAppNumber" : whatsAppNumber,
            "lastDonationDate" : lastDonationDate

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


module.exports={handleNewDonor}