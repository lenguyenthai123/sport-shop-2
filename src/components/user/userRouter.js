const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passport.js");

const Controllers = require("./userController.js");
const multerConfig = require("../../config/multer.js")
const multer = require("multer");

const upload = multerConfig;


router.get("/user/home-page", passport.authenticate('jwt', { session: false }), Controllers.checkRoleAndRedirect, Controllers.getHomePage);
router.get("/user/home-page/products/paging", passport.authenticate('jwt', { session: false }), Controllers.getProductsForPaging);

router.get("/user/home-page/cart", passport.authenticate('jwt', { session: false }), Controllers.getCart)

router.post("/user/home-page/:productId/review", passport.authenticate('jwt', { session: false }), Controllers.postAReview)

// Paging
router.get("/user/home-page/:productId/review", passport.authenticate('jwt', { session: false }), Controllers.getReviewsForPaging)

// Add product to cart
router.post("/user/home-page/:productId/cart", passport.authenticate('jwt', { session: false }), Controllers.patchAProductToCart)

router.get("/user/home-page/:productId", passport.authenticate('jwt', { session: false }), Controllers.getProductDetail)

//User profile
router.get("/user/profile", passport.authenticate('jwt', { session: false }), Controllers.getAccountProfile);

router.patch("/user/profile/avatar", passport.authenticate('jwt', { session: false }), upload.single("avatar"), Controllers.patchAvatarProfile);
router.patch("/user/profile", passport.authenticate('jwt', { session: false }), Controllers.patchUserProfile);



module.exports = router;
