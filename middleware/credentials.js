const list = require("../config/list")

const credentials = (req, res, next) =>{
    const origin = req.headers.origin;
    if(list.includes(origin)){
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;