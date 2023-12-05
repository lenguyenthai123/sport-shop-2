const express = require("express")
const router = express.Router();

const Controllers = require("./guestController");

router.get("/", Controllers.checkRoleAndRedirect, Controllers.redirectHomePage);
router.get("/all-product", Controllers.checkRoleAndRedirectAllProduct, Controllers.getAllProductPage);
router.get("/home-page", Controllers.checkRoleAndRedirect, Controllers.getHomePage);
router.get("/home-page/products/paging", Controllers.checkRoleAndRedirect, Controllers.getProductsForPaging);

router.get("/cart", Controllers.checkRoleAndRedirectCart, Controllers.getCart)

// Product detail and paging.
router.get("/home-page/:productId/review", Controllers.getReviewsForPaging)
router.post("/home-page/:productId/cart", Controllers.patchAProductToCart) // AJAX for 

router.get("/home-page/:productId", Controllers.checkRoleAndRedirectProductPage, Controllers.getProductDetailPage)

router.get("/info-product/:productId", Controllers.getProductDetailInfo)


// router.get("/profile", Controllers.getAccountProfile);


module.exports = router;
