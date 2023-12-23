const Order = require("./orderModel")
const Product = require("../product/productModel")
const moongose = require("mongoose")

const createOrder = async (order) => {
    await Order.create(order);
}

const getOrderList = async (id) => {
    return await Order.find({userId: new moongose.Types.ObjectId(id)});
}

const getAllOrder = async () => {
    return await Order.find({});
}

const getOrderDetail = async (orderId) => {
    return await Order.findById(orderId);
}

const deleteOrder = async (orderId) => {
    await Order.findByIdAndDelete(orderId);
}

module.exports = {
    createOrder,
    getAllOrder,
    getOrderList,
    getOrderDetail,
    deleteOrder,
}