const { check } = require("express-validator");

const loginValidation = [
    check('email', "Enter correct email").normalizeEmail().isEmail(),
    check('password', 'Enter password').exists()
    //name
]

const registerValidation = [
    check('email', "Uncorrect email").isEmail(),
    check('password', 'Password must be longer than 3 and shorter than 12').isLength({min:3, max:12})
    //name
]

const productCreateValidation = [
    check('title', 'Enter the title').isLength({ min: 3 }).isString(),
    check('description', 'Enter the description').isLength({ min: 3 }).isString(),
    check('category', 'Select the category').isLength({ min: 3 }).isString(),
    check('sizes', 'Enter the sizes').isLength({ min: 3 }).isString(),
    check('imgUrl', 'Invalid image link').optional().isString(),
]

module.exports = {
    loginValidation,
    registerValidation,
    productCreateValidation
}