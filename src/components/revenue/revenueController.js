const Jwt = require("jsonwebtoken")
const moongose = require("mongoose")
const orderService = require('./orderService');
const userService = require('../user/userService')
const productService = require('../product/productService');
const User = require('../user/userModel');
const Revenue = require('./revenueModel');
const RevenueService = require('./revenueService');

require("dotenv").config();

const createRevenue = async (req, res, next) => {

    try {
        const orderId = req.body.orderId;

        const result = await RevenueService.create(orderId);
        if (result) {
            res.status(201).json({ message: "Create revenue successfully" });
        }
        else {
            res.status(400).json({ message: "Invalid order ID" });
        }
    }
    catch (err) {
        next(err);
    }
}
const getChartValue = async (req, res, next) => {

    try {
        const type = req.query.type;
        const startTime = req.query.startTime;
        const endTime = req.query.endTime;

        const revenueList = await RevenueService.getRevenueValueForChart(type, startTime, endTime);

        res.status(200).json(revenueList);
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    createRevenue,
    getChartValue
}