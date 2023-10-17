const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name can't be exceed 30 charaters"],
    minLength: [4, "Name should have more that 4 charaters"]
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter Valid Email"]
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [8, "Password Should be min 8 charaters"],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: "user"
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
})

// Encode Password
userSchema.pre("save", async function(next){
  if(!this.isModified("password")){ 
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

// JWT Token
userSchema.methods.getJWTToken = function(){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE})
}

// JWT Token
userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password)
}

//Generating Password Reset token
userSchema.methods.getResetPasswordToken = function() {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString('hex')

  //Hashing and adding resetToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex')

  this.resetPasswordExpire = Date.now() + 15*60*1000

  return resetToken
}

module.exports = mongoose.model("User", userSchema)