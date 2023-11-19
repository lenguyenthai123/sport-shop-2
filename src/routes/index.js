const express = require("express");

const router = express.Router();

const passport = require("passport");
require("../middlewares/passportAccessToken");


const routerAuthentication = require("../components/auth/authRouter");
const routerAdmin = require("../components/admin/adminRouter");
const routerGuest = require("../components/guest/guestRouter");
const routerProduct = require("../components/product/productRouter");

router.use("/", routerAuthentication);
router.use("/", routerAdmin);
router.use("/", routerGuest);
router.use("/", routerProduct);


module.exports = router;