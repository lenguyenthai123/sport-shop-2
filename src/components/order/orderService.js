const Order = require("./orderModel")
const Product = require("../product/productModel")
const moongose = require("mongoose")

const createOrder = async (order) => {
    return Order.create(order);
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

const updateOrderStatusToDeliver = async (orderId) => {
    await Order.findByIdAndUpdate(orderId, {
        status: "Delivering"
    })
}

module.exports = {
    createOrder,
    getAllOrder,
    getOrderList,
    getOrderDetail,
    deleteOrder,
    updateOrderStatusToDeliver,
}