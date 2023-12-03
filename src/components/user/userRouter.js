const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passport.js");

const { checkTokenAndActivationValidate } = require("../auth/authMiddleware.js");


const Controllers = require("./userController.js");
const multerConfig = require("../../config/multer.js")
const multer = require("multer");

const upload = multerConfig;


router.get("/user/home-page", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.getHomePage);

router.get("/user/all-product", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.getAllProductPage);

router.get("/user/home-page/products/paging", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.getProductsForPaging);

router.get("/user/cart", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.getCart)

router.post("/user/home-page/:productId/review", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.postAReview)

// Paging
router.get("/user/home-page/:productId/review", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.getReviewsForPaging)

// Add product to cart
router.post("/user/home-page/:productId/cart", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.patchAProductToCart)

router.get("/user/home-page/:productId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.getProductDetail)

//User profile
router.get("/user/profile", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.getAccountProfile);

router.patch("/user/profile/avatar", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, upload.single("avatar"), Controllers.patchAvatarProfile);
router.patch("/user/profile", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, Controllers.checkRoleAndRedirect, Controllers.patchUserProfile);



module.exports = router;
