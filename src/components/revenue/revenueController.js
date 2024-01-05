const RevenueService = require('./revenueService');
const Order = require('../order/orderModel');

require("dotenv").config();

const createRevenue = async (req, res, next) => {

    try {
        const orderId = req.body.orderId;
        console.log(orderId);
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
        const startTime = new Date(req.query.startTime);
        const endTime = new Date(req.query.endTime);

        console.log("vao day: " + type + " " + startTime + " " + endTime);

        const revenueList = await RevenueService.getRevenueValueForChart(type, startTime, endTime);
        console.log("Vuot qua");

        res.status(200).json(revenueList);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const getTopRevenue = async (req, res, next) => {

    try {
        const startTime = new Date(req.query.startTime);
        const endTime = new Date(req.query.endTime);
        console.log("vao day: " + " " + startTime + " " + endTime);
        const topList = await RevenueService.getTopRevenueProduct(startTime, endTime);
        console.log("Vuot qua");
        res.status(200).json(topList);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

// const fix = async (req, res, next) => {

//     try {
//         const list = await Order.find({});
//         for (let i = 0; i < list.length; i++) {
//             const order = list[i];
//             // console.log(order)
//             const result = await RevenueService.create(order._id);

//         }
//         console.log("Thanh cong");
//     }
//     catch (err) {
//         console.log(err);
//         next(err);
//     }
// }

module.exports = {
    createRevenue,
    getChartValue,
    getTopRevenue,
}