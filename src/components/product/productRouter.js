const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passport.js");


const Controllers = require("./productController.js");

// router.get("/", Controllers.redirectHomePage);
// router.get("/home-page", Controllers.getHomePage);
// router.get("/home-page/cart", Controllers.getCart)
// router.get("/home-page/:productId", Controllers.getProductDetail)

router.get("/product/aaa/mmmm/", Controllers.postAnProduct)

module.exports = router;
