const express = require('express');
const router = express.Router();

const passport = require("passport");
require("../../middlewares/passport.js");


const { checkTokenAndActivationValidate } = require("../auth/authMiddleware.js");

const Controller = require("./revenueController");

const checkAdmin = (req, res, next) => {
    if (req.user.role === `admin`) {
        return next();
    }
    else {
        return res.status(403).json({ message: 'Permission denied' });
    }
}

router.post("/revenue", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controller.createRevenue);

router.get("/revenue/chart", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controller.getChartValue);

router.get("/revenue/top", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controller.getTopRevenue);


// router.get("/revenue/fix", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkTokenAndActivationValidate, checkAdmin, Controller.fix);

module.exports = router;