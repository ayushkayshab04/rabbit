const { v4: uuidv4 } = require('uuid');

const logIdAssign = async(req,res,next)=>{
    req.logId = uuidv4()
    next();
}


module.exports = {
    logIdAssign
}