const list = require("./list")
const crosOptions = {
    origin : (origin, callback )=>{
        if(list.indexOf(origin) !== -1 ){
            callback(null, true);
        }

        else
           callback(new Error('Not allowed by CORS'));
    },
    optionSuccessStatus : 200
}

module.exports = {crosOptions}