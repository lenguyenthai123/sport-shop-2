const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passportAccessToken");

const Controllers = require("./guestController");

router.get("/", Controllers.redirectHomePage);
router.get("/home-page", Controllers.getHomePage);
router.get("/home-page/products/paging", Controllers.getProductsForPaging);

router.get("/home-page/cart", Controllers.getCart)

// Product detail and paging.
router.get("/home-page/:productId/review", Controllers.getReviewsForPaging)
router.get("/home-page/:productId", Controllers.getProductDetail)


router.get("/profile", Controllers.getAccountProfile);


module.exports = router;
