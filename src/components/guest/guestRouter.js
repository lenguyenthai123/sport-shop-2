const express = require("express")
const router = express.Router();

const Controllers = require("./guestController");

router.get("/", Controllers.checkRoleAndRedirect, Controllers.redirectHomePage);
router.get("/home-page", Controllers.checkRoleAndRedirect, Controllers.getHomePage);
router.get("/home-page/products/paging", Controllers.checkRoleAndRedirect, Controllers.getProductsForPaging);

router.get("/home-page/cart", Controllers.checkRoleAndRedirect, Controllers.getCart)

// Product detail and paging.
router.get("/home-page/:productId/review", Controllers.checkRoleAndRedirect, Controllers.getReviewsForPaging)
router.post("/home-page/:productId/cart", Controllers.checkRoleAndRedirect, Controllers.patchAProductToCart) // AJAX for 

router.get("/home-page/:productId", Controllers.checkRoleAndRedirect, Controllers.getProductDetail)


// router.get("/profile", Controllers.getAccountProfile);


module.exports = router;
