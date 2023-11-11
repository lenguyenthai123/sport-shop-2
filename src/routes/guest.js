const express = require("express")
const router = express.Router();

const passport = require("passport");
require("../middlewares/passportAccessToken.js");

const Controllers = require("../controllers/guest.js");

router.get("/", Controllers.redirectHomePage);
router.get("/home-page", Controllers.getHomePage);
router.get("/home-page/:productId", Controllers.getProductDetail)

module.exports = router;
