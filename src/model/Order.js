const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderScheme = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Tham chiếu đến user mà đặt hàng 
    },
    listItem: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: `Product`,
            },
            quantity1: Number
        }
    ],
    status: {
        type: String,
        default: "Processing"
    },
    subTotal: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    phoneNumber: {
        type: String,
        required: [true, "Please provide phonenumber"]
    },
    fullname: {
        type: String,
        maxLength: 20,
        default: "full name",
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});


module.exports = mongoose.model('Order', OrderScheme);