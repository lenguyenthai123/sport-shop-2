const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RevenueScheme = new Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Tham chiếu đến user mà đặt hàng 
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `Product`,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});


module.exports = mongoose.model('Revenue', RevenueScheme);