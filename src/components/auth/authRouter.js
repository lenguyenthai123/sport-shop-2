const express = require("express");

const router = express.Router();

const passport = require("passport");
require("../../middlewares/passportAccessToken");

const Authentication = require("./authController");


router.get("/signup", Authentication.getSignUp);
router.post("/signup", Authentication.postSignUp);

router.post("/login", Authentication.postLogin);
router.get("/login", Authentication.getLogin);


router.get("/logout", passport.authenticate('jwt', { session: false }), Authentication.getLogout);

router.get("/forgot-password", Authentication.getForgotPassword)
router.post("/forgot-password", Authentication.postForgotPassword)

router.get("/reset-password", Authentication.getResetPassword)
router.post("/reset-password", Authentication.postResetPassword)

router.get("/update-password", passport.authenticate('jwt', { session: false }), Authentication.getUpdatePassword)
router.post("/update-password", passport.authenticate('jwt', { session: false }), Authentication.postUpdatePassword)

module.exports = router;