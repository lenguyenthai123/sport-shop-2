const User = require("../user/userModel")

const { body, validationResult } = require("express-validator");

const loginValidators = [
    body("username").notEmpty().isLength({ min: 6 }).escape(),
    body("password").notEmpty().isLength({ min: 6 }).escape(),
]

const signupValidators = [
    body("email").trim()
        .notEmpty().withMessage("Email must not be empty")
        .isEmail().withMessage("Email is invalid")
        .escape()
        .custom(async value => {
            const foundedUser = await User.findOne({ email: value });
            if (!foundedUser) {
                return true;
            }
            else {
                throw new Error("Email is already registered");
            }
        }),

    body("username")
        .notEmpty().withMessage("Username must not be empty")
        .isLength({ min: 6 }).withMessage('Username must be at least 6 characters')
        .escape()
        .custom(async value => {
            const foundedUser = await User.findOne({ username: value });
            if (!foundedUser) {
                return true;
            }
            else {
                throw new Error("User is already registered");
            }
        }),

    body("fullname").trim()
        .notEmpty().withMessage("Fullname must not be empty")
        .escape()
    ,

    body("password")
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isStrongPassword().withMessage('Password must contain at least: one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), one special character (e.g., ! @ #)')
        .escape(),

    body("passwordConfirmation").escape().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    })

]

const forgotPasswordValidator = [
    body("email").trim()
        .notEmpty().withMessage("Email must not be empty")
        .isEmail().withMessage("Email is invalid")
        .escape()
]

const resetPasswordValidator = [
    body("password")
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .isStrongPassword().withMessage('Password must contain at least: one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), one special character (e.g., ! @ #)')
        .escape(),

    body("passwordConfirmation").escape().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    })
]

const updatePasswordValidator = [

    body("password").notEmpty().isLength({ min: 6 }).escape(),

    body("newPassword")
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
        .isStrongPassword().withMessage('New password must contain at least: one uppercase letter (A-Z), one lowercase letter (a-z), one digit (0-9), one special character (e.g., ! @ #)')
        .escape(),

    body("passwordConfirmation").escape().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    })
]

module.exports = {
    loginValidators,
    signupValidators,
    forgotPasswordValidator,
    resetPasswordValidator,
    updatePasswordValidator
}
