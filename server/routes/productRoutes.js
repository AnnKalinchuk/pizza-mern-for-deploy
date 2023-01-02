const { Router } = require('express')
const { check } = require('express-validator')
const router = new Router()

const { productCreateValidation } = require('../utils/validations')
const roleMiddleware = require('../middleware/roleMiddleware')
const productControllers = require('../controllers/ProductController')
const upload = require('../middleware/uploadFileMidlleware');
const paginatedResults = require('../middleware/paginationMiddleware')
const Product = require('../models/Product')

//router.get('/admin', checkAuth, productControllers.getAll)

router.post('/', productCreateValidation, roleMiddleware(['ADMIN']), upload.single('image'), productControllers.createProduct)
router.get('/', paginatedResults(Product), productControllers.getAllProducts)
router.get('/:id', productControllers.getProductById)
router.delete('/:id', roleMiddleware(['ADMIN']), productControllers.removeProduct)
router.patch('/:id', roleMiddleware(['ADMIN']), upload.single('image'), productControllers.updateProduct)


module.exports = router