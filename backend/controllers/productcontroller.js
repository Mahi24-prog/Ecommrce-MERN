const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/apiFeatures")

//Create Produtct -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    
    const product = await Product.create(req.body)
    res.status(200).json({
      success: true,
      product
    })
  }
)

//Get All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage)
    const products = await apiFeature.query
    res.status(200).json({
      succes: true,
      products,
      productCount
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

// Create and update reviews

exports.createProductReviews = catchAsyncError(async (req, res, next) => {
  const  {rating, comment, productId } = req.body

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  }

  const product = await Product.findById(productId)

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  )

  if(isReviewed){
    product.reviews.forEach( rev => {
      if(rev.user.toString() === req.user._id.toString()){
        rev.rating = review.rating;
        rev.comment = review.comment
      }
    })
  }else{
    product.reviews.push(review)
    product.numOfReviews = product.reviews.length
  }

  let avg = 0
  product.reviews.forEach( rev => {
    avg += +rev.rating
  })  
  product.rating = avg/product.reviews.length

  await product.save({validateBeforeSave:false})

  res.status(200).json({
    succes: true
  })
})

// Get All reviews of single product

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  console.log(req.query);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404))
  }

  res.status(200).json({
    succes: true,
    reviews: product.reviews,
  })
})

// Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404))
  }
  console.log(product)
  const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

  let avg = 0
  reviews.forEach( rev => {
    avg += +rev.rating
  })  
  const rating = avg/reviews.length
  const numOfReviews = reviews.length
  
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    rating,
    numOfReviews
  },{
    new: true,
    runValidator: true,
    useFindAndModify: false
  })

  res.status(200).json({
    succes: true,
    message: "Review Deleted Successfull"
  })
})