const {format } = require("date-fns")
const { v4: uuid} = require("uuid");
const fs = require("fs");
const path = require("path");

const logEvents = (massage, logName) =>{
    const dateTime = `${format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')}`;
    const logItem = `${dateTime} \t${uuid()}\t${massage}\n`

    try{
        if(!fs.existsSync(path.join(__dirname,"..","logs"))){
            fs.mkdir(path.join(__dirname,"..","logs"), (err)=>{
                if(err) throw err;
                console.log("log filecreated successfully")
            })
        }

        fs.appendFile(path.join(__dirname,"..","logs",logName),logItem, (err)=>{
            if(err) throw err;
            console.log("log data appended");
        })
    }catch(err){
        console.log("error in opening log file ")
    }
}


// logger is middleware functions that we pass in use("/",logger) to log info
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "logData.txt");
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };