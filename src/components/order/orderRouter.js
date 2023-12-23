const express = require('express');
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passport.js");


const { checkTokenAndActivationValidate } = require("../auth/authMiddleware.js");

const controller = require("./orderController");

const checkAdmin = (req, res, next) => {
    if (req.user.role === `admin`) {
        return next();
    }
    else {
        return res.status(403).json({ message: 'Permission denied' });
    }
}

router.post("/user/create-order", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, controller.createOrder);
router.get("/user/order", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, controller.getOrderListByUser);
router.get("/user/order/:orderId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, controller.getOrderByUser);


router.get("/admin/order/:orderId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, controller.getOrderDetailByAdmin);
router.delete("/admin/order/:orderId", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, controller.deleteOrderByAdmin);

module.exports = router;