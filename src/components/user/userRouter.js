const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passportAccessToken.js");

const Controllers = require("./userController.js");


router.get("/user/home-page", passport.authenticate('jwt', { session: false }), Controllers.getHomePage);
router.get("/user/home-page/products/paging", passport.authenticate('jwt', { session: false }), Controllers.getProductsForPaging);

router.get("/user/home-page/cart", passport.authenticate('jwt', { session: false }), Controllers.getCart)
router.get("/user/home-page/:productId", passport.authenticate('jwt', { session: false }), Controllers.getProductDetail)


router.get("/user/profile", passport.authenticate('jwt', { session: false }), Controllers.getAccountProfile);

module.exports = router;
