const mongoosePaginate = require('mongoose-paginate-v2');
const Catalog = require("../catalog/catalogModel");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductScheme = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide name"],
    },
    catalogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catalog' // Tham chiếu đến schema danh mục sản phẩm (Catalog)
    },
    catalogName: {
        type: String,
        trim: true
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
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReview: {
        type: Number,
        default: 0,
    }
});


ProductScheme.pre("save", async function () {
    try {
        if (!this.isModified("catalogId")) return;
        const catalog = await Catalog.findById(this.catalogId);
        if (catalog) {
            this.catalogName = catalog.name;
        }
    }
    catch (error) {
        throw (error);
    }
});

ProductScheme.plugin(mongoosePaginate);


module.exports = mongoose.model('Product', ProductScheme);