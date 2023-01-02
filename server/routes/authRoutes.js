const { Router } = require('express')
const { check } = require('express-validator') ///удалить?
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')
const handleValidationErrors = require('../utils/handleValidationErrors')


const userControllers = require('../controllers/AuthController')
const { registerValidation, loginValidation } = require('../utils/validations')


router.post('/register', registerValidation, handleValidationErrors, userControllers.register)

router.post('/login', loginValidation, handleValidationErrors, userControllers.login)

router.get('/users', roleMiddleware(['ADMIN']), userControllers.getUsers)

module.exports = router