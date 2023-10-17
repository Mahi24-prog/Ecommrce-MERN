const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const User = require("../models/userModel")
const sendToken = require("../utils/jwtToekn")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

//Register User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await User.create({
    name, email, password,
    avatar: {
      public_id: "this is simple id",
      url: "profileUrl"
    }
  })

  sendToken(user, 201, res)
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body

  //checking if user has given email and password both
  if (!email || !password) return next(new ErrorHandler("Please Enter Email & Password", 400))

  const user = await User.findOne({ email }).select("+password")
  if (!user) return next(new ErrorHandler("Invalid Email Or Password", 401))

  const isPasswordMatched = await user.comparePassword(password)
  if (isPasswordMatched) {
    sendToken(user, 200, res)
  } else {
    return next(new ErrorHandler("Invalid Email Or Password", 401))
  }
})

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    message: 'Logout Successfully'
  })
})

//Forgot Passwod
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) return next(new ErrorHandler("User not found!", 404))

  //Get Reset Password Token 
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  const resetPasswordUrl = `${req.protocol}://${res.get("host")}/api/v1/password/reset/${resetToken}`

  const message = `Your Password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, ignore it`

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Reset`,
      message
    })

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`
    })
  } catch (err) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(err.message, 404))
  }
})

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //Creating token hash
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

  if (!user) return next(new ErrorHandler("Reset Password token is invalid or has been expired!", 400))

  if (req.body.password !== req.body.confirmPassword) return next(new ErrorHandler("Password and Confirm Password does't match", 400))

  user.password = req.body.password
  user.resetPasswordExpire = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  sendToken(user, 200, res)
})

//Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    user
  })
})

//Get User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password")

  const isPasswordMatched = user.comparePassword(req.body.oldPassword)
  if (!isPasswordMatched) return next(new ErrorHandler("Old Password is Incorrect", 400))


  if (req.body.newPassword !== req.body.confirmPassword) return next(new ErrorHandler("New Password and Confirm Password does't match", 400))

  user.password = req.body.newPassword

  await user.save()

  sendToken(user, 200, res)
})

//Get User Password
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email:req.body.email
  }
  
  const user = await User.findByIdAndUpdate(req.user.id, newUserData,{ 
    new: true,
    runValidators: true,
    useFindAndModify:false
  })
  // await user.save()

  res.status(200).json({
    success:true,
    message:"Profile Updated Successfully"
  })
})

///Get All Users
exports.getAllUSers = catchAsyncError(async (req, res,next)  => {
  const users = await User.find()

  res.status(200).json({
    success: true,
    users
  })
})

///Get Single Users
exports.getUser = catchAsyncError( async (req, res,next)  => {
  const user = await User.findById(req.params.id)

  if (!user) return next( new ErrorHandler(`User doesn't Exists with id ${req.params.id}`, ) )

  res.status(200).json({
    success: true,
    user
  })
})

//Get User Role -- Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email:req.body.email,
    role: req.body.role
  }
  
  const user = await User.findByIdAndUpdate(req.params.id, newUserData,{ 
    new: true,
    runValidators: true,
    useFindAndModify:false
  })
  // await user.save()

  res.status(200).json({
    success:true,
    message:"Profile Updated Successfully"
  })
})

//delete User -- Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {  
  const user = await User.findById(req.params.id)
  
  if (!user) return next( new ErrorHandler(`User doesn't Exists with id ${req.params.id}`, ) )
  
  await user.deleteOne()

  res.status(200).json({
    success:true,
    message:"User Deleted Successfully"
  })
})
