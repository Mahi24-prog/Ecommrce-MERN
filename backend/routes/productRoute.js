const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct, createProductReviews, getProductReviews, deleteReview } = require('../controllers/productcontroller')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router.route('/products').get(getAllProducts)

router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct)
router.route('/admin/product/:id')
  .put(isAuthenticatedUser, updateProduct)
  .delete(isAuthenticatedUser, deleteProduct)

router.route('/product/:id').get(getProduct)

router.route('/review').put(isAuthenticatedUser, createProductReviews)
router.route('/reviews').get(getProductReviews).delete(isAuthenticatedUser,deleteReview)

module.exports = router