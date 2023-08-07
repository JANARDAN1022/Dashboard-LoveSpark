const asyncerrorhandler = require('../Middlewares/AsyncError');
const Admin = require('../Models/AdminModel');
const sendToken = require('../utils/JWToken');
const ErrorHandler = require('../Middlewares/ErrorHandler.js');



//Register-Admin
exports.RegisterAdmin = asyncerrorhandler(async(req,res,next)=>{
const {Name,Email,Password,ProfileUrl,confirmPassword} = req.body;
if(Password!==confirmPassword){
    return next({message:'Passwords Do Not Match',StatusCode:403});
   }

   const AdminExists = await Admin.findOne({Email});
   if(AdminExists){
    return next({message:'Admin already Exists LogIn Instead',statusCode:404});
   }else{
    const NewAdmin = await Admin.create({
        AdminName:Name,
        Email:Email,
        Password:Password,
        ProfileUrl:ProfileUrl?ProfileUrl:''
    });
  sendToken(NewAdmin,200,res);
}
});



//Login User With Email
exports.LoginAdmin= asyncerrorhandler(async(req,res,next)=>{
    const {Email,Password} = req.body;
  
    if(!Email || !Password){
      return next({message: 'Please Enter Email And Password', statusCode: 400})
    }
  
    const AdminExists = await Admin.findOne({Email}).select('+Password');
  
    if(!AdminExists){
      return next({message:'Incorrect Email or Password',statusCode:404});
    }
  
    const passwordmatched = await AdminExists.comparepassword(Password);
    if(!passwordmatched){
      return next({message:'Incorrect Email or password',statusCode:401});
    } 
    sendToken(AdminExists,200,res);
  });


  //Get Admin Details
  exports.AdminDetails = asyncerrorhandler(async(req,res,next)=>{
    const AdminInfo = await Admin.findById(req.Admin.id);
    res.status(200).json({
        success:true,
        AdminInfo
    });
  });


  //logout
exports.logout = asyncerrorhandler(async (req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
     });  
    res.status(200).json({success:true,message:"logged out"});
  });


//Check Admin Exists To Block Register Route in Frontend?
exports.AdminExists = asyncerrorhandler(async(req,res,next)=>{
const admin = await Admin.find({});
if(admin.length>0){
  const Length = admin.length;
  res.status(200).json({Length,admin});
}
}); 


// Update Admin Details
exports.UpdateAdminDetails = asyncerrorhandler(async (req, res, next) => {
  const { Email, Password, NewEmail, NewPassword, NewProfileUrl } = req.body;
  if (Email && Password) {
    // Find the admin by email
    const admin = await Admin.findOne({ Email: Email }).select('+password');

    if (!admin) {
      return next({ message: 'Admin not found', statusCode: 404 });
    }

    // Verify the current password
    const passwordMatched = await admin.comparepassword(Password);
    if (!passwordMatched) {
      return next({ message: 'Invalid current password', statusCode: 401 });
    }

    // Update email if a new email is provided
    if (NewEmail) {
      admin.Email = NewEmail;
    }

    // Update password if a new password is provided
    if (NewPassword) {
      if (NewPassword === Password) {
        return next({ message: 'NewPassword Cannot Be Same As Old Password', statusCode: 401 });
      }
      admin.Password = NewPassword; //the password is hashed in the preSave hook
    }

    // Update profile URL if a new profile URL is provided
    if (NewProfileUrl) {
      admin.ProfileUrl = NewProfileUrl;
    }

    // Save the updated admin
    const updatedAdmin = await admin.save();

    res.status(200).json({ updatedAdmin });
  }
});

