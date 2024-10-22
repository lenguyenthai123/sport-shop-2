const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Tham chiếu đến schema sản phẩm (Product)
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến schema người dùng (User)
        required: true
    },
    username: {
        type: String,
        required: true,
    }
    ,
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
    },
    datePost: {
        type: Date,
        default: Date.now(),
    }
});

reviewSchema.plugin(mongoosePaginate);


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
