const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductScheme = new Schema({
    catalogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catalog' // Tham chiếu đến schema danh mục sản phẩm (Catalog)
    },
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide name"],
    },
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
    thumbnail: {
        type: String
    },
    gallery: {
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
    },
    status: {
        type: String,
        required: [true, `Please provide status`],
    }

});



module.exports = mongoose.model('Product', ProductScheme);