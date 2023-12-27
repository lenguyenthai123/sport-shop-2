const Order = require("./orderModel")
const Product = require("../product/productModel")
const moongose = require("mongoose")

const createOrder = async (order) => {
    return Order.create(order);
}

const getOrderList = async (id) => {
    await Order.updateMany(
        { paymentMethod: { $exists: false } },
        { $set: { paymentMethod: 'CashOnDeli' } },
        { multi: true }
    )
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

const updateOrderPaymentMethod = async (orderId, method) => {
    await Order.findByIdAndUpdate(orderId, {
        paymentMethod: method
    })
}

module.exports = {
    createOrder,
    getAllOrder,
    getOrderList,
    getOrderDetail,
    deleteOrder,
    updateOrderPaymentMethod,
}