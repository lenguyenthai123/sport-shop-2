const express = require("express");

const router = express.Router();

const passport = require("passport");
require("../../middlewares/passport.js");

const { body, validationResult } = require("express-validator");
const Middlewares = require("./authMiddleware.js");

const Authentication = require("./authController");


router.get("/signup", Authentication.getSignUp);

// Router using for ajax.
router.post("/signup-check", Middlewares.signupValidators, Authentication.validatorSignupOk)
router.post("/signup", Middlewares.signupValidators, Authentication.postSignUp);

router.post("/login", Middlewares.loginValidators, passport.authenticate('local'), Authentication.postLogin);
router.get("/login", Authentication.getLogin);

router.get("/logout", passport.authenticate('jwt', { session: false }), Authentication.getLogout);

router.get("/forgot-password", Authentication.getForgotPassword)
router.post("/forgot-password", Middlewares.forgotPasswordValidator, Authentication.postForgotPassword)

router.get("/reset-password", Authentication.getResetPassword)
router.post("/reset-password", Middlewares.resetPasswordValidator, Authentication.postResetPassword)

router.get("/update-password", passport.authenticate('jwt', { session: false }), Authentication.getUpdatePassword)
router.post("/update-password", passport.authenticate('jwt', { session: false }), Middlewares.updatePasswordValidator, Authentication.postUpdatePassword)

router.get("/account/active/:activeToken", Authentication.getActivation);
module.exports = router;