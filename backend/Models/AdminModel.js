const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const AdminSchema = new mongoose.Schema({
   AdminName: {
    type:String, 
    required: true
  },
  Email:{
    type:String,
    required:true,
  },
  Password:{
    type:String,
    required:true,
  },
  ProfileUrl:{
    type:String,
  },
});

//hiding password
AdminSchema.pre("save",async function(next){
    if(!this.isModified("Password")){
        next();
    }
    this.Password = await bcrypt.hash(this.Password,10);    
})
//jwt token
 

AdminSchema.methods.getjwtToken = function(){
    return jwt.sign({id:this._id},process.env.SEC_KEY,{
        expiresIn: process.env.jwtExpire
    });
};

//compare password

AdminSchema.methods.comparepassword = async function(enteredpassword){
    return  await  bcrypt.compare(enteredpassword,this.Password);
}

//resetpassword token
AdminSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hashing and adding to userschema

    this.resetpasswordtoken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetpasswordexpired = Date.now() + 10 * 60 * 1000;

    return resetToken;

}



module.exports = mongoose.model('Admin', AdminSchema);
