const Order = require("../models/orderModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apiFeatures")

// Create New Order

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body

  const order = await Order.create({
    shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, 
    paidAt: Date.now(),
    user: req.user._id
  })
  res.status(201).json({
    success:true,
    order
  })
}) 

// Get Single Order
exports.getSingleOrder = catchAsyncError( async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email")

  if(!order) return next(new  ErrorHandler("Order not found with this Id", 404))

  res.status(200).json({
    success: true,
    order
  })
})

// Get logged in user Order
exports.myOrders = catchAsyncError( async (req, res, next) => {
  const order = await Order.find({user: req.user._id})

  res.status(200).json({
    success: true,
    order
  })
})