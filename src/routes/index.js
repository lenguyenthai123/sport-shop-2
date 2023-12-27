const express = require("express");

const router = express.Router();

const passport = require("passport");
require("../middlewares/passport.js");


const routerAuthentication = require("../components/auth/authRouter");
const routerAdmin = require("../components/admin/adminRouter");
const routerGuest = require("../components/guest/guestRouter");
const routerUser = require("../components/user/userRouter");
const routerProduct = require("../components/product/productRouter");
const routerOrder = require("../components/order/orderRouter");
const routerPayment = require("../components/order/payment.js")
const routerRevenue = require("../components/revenue/revenueRouter.js");

router.use("/", routerAuthentication);
router.use("/", routerAdmin);
router.use("/", routerGuest);
router.use("/", routerUser);
router.use("/", routerProduct);
router.use("/", routerOrder);
router.use("/", routerPayment);
router.use("/", routerRevenue);



module.exports = router;