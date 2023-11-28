const express = require("express")
const router = express.Router();

const Controllers = require("./guestController");

router.get("/", Controllers.redirectHomePage);
router.get("/home-page", Controllers.getHomePage);
router.get("/home-page/products/paging", Controllers.getProductsForPaging);

router.get("/cart", Controllers.getCart)

// Product detail and paging.
router.get("/home-page/:productId/review", Controllers.getReviewsForPaging)
router.post("/home-page/:productId/cart", Controllers.patchAProductToCart) // AJAX for 

router.get("/home-page/:productId", Controllers.getProductDetail)


// router.get("/profile", Controllers.getAccountProfile);


module.exports = router;
