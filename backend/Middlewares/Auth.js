const catchasyncerror = require('./AsyncError');
//const errorHandle = require('./ErrorHandler');
const jwt = require('jsonwebtoken');
const Admin = require('../Models/AdminModel');



exports.authenticate = catchasyncerror(async (req,res,next)=>{
    const {token} = req.cookies;
    
    if(!token){
        next({message:"Please login",statusCode:401});
    }

    const DecodedData = jwt.verify(token,process.env.SEC_KEY);

    req.Admin = await Admin.findById(DecodedData.id);
    next();
});

