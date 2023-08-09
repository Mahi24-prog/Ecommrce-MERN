const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")

//Create Produtct -- Admin
exports.createProduct = catchAsyncError(
  async (req, res, next) => {
    const product = await Product.create(req.body)
    res.status(200).json({
      success: true,
      product
    })
  }
)

//Get All Products
exports.getAllProducts = catchAsyncError(
  async (req, res) => {
    const products = await Product.find()
    res.status(200).json({
      succes: true,
      products
    })
  }
)

//Get one Product
exports.getProduct = catchAsyncError(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id)
  
    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404))
    }
  
    res.status(200).json({
      success: true,
      product
    })
  }
)

//Update Product
exports.updateProduct = catchAsyncError(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id)
  
    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404))
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
      useFindAndModify: false
    })
  
    res.status(200).json({
      success: true,
      product
    })
  }
)

//Update Product
exports.deleteProduct = catchAsyncError(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id)
  
    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404))
    }
  
    await product.deleteOne()
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  }
)