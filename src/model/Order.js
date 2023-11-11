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
    }
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: 0
    },
    description: {
        type: String,
        trim: true,
        default: "None",
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    imageList: {
        type: [String],
        default: [],
        validate: {
            validator: function (value) {
                return value.every(url => typeof url === 'string' && url.trim().length > 0);
            },
            message: 'Invalid image URLs in the list'
        }
    },
    creationTime: {
        type: Date,
        default: Date.now(),
    },
    view: {
        type: Number,
        default: 0,
        min: 0
    },
    // nhà sản xuất
    manufacturer: {
        type: String,
        required: [true, "Please provide manufacturer"],
        trim: true
    },
    // sort theo tống số lần mua
    totalPurchase: {
        type: Number,
        default: 0,
    }


});


module.exports = mongoose.model('Product', ProductScheme);