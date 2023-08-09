const express = require('express')
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct} = require('../controllers/productcontroller')

const router = express.Router()

router.route('/products').get(getAllProducts)
router.route('/product/new').post(createProduct)
router.route('/product/:id').get(getProduct).post(updateProduct).delete(deleteProduct)

module.exports = router