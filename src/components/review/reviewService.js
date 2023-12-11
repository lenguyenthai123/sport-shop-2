const Review = require("./reviewModel");
const Product = require("../product/productModel")
const { ObjectID } = require('mongodb');
const mongoose = require("mongoose");

const createAReview = async function (productId, userId, fullname, rating, comment) {
    try {
        if (mongoose.isValidObjectId(productId) && mongoose.isValidObjectId(userId)) {

            const review = {
                productId: new mongoose.Types.ObjectId(productId),
                userId: new mongoose.Types.ObjectId(userId),
                rating: parseFloat(rating),
                comment,
                username: fullname,
            }
            const product = await Product.findById(productId);

            // Cập nhật cho rating cho product
            product.rating = (product.totalReview * product.rating + parseFloat(rating)) / (product.totalReview + 1);
            console.log(product.rating)
            console.log(parseFloat(rating))
            product.totalReview++;
            await product.save();

            const result = await Review.create(review);
            return { result, averageRating: product.rating, totalReview: product.totalReview };
        }
        else {
            return null;
        }
    } catch (error) {
        throw error
    }
}

const filteredAndGetPagingReviews = async function (productId, page) {
    try {
        if (mongoose.isValidObjectId(productId)) {
            console.log("filter");
            const options = {
                page: parseInt(page, 10),
                limit: 5,
                sort: { datePost: -1 }
            }
            const result = await Review.paginate({ productId: new mongoose.Types.ObjectId(productId) }, options);

            return result;
        }
        else {
            return null;
        }
    } catch (error) {
        console.log("Error in filter and get paging from review");
        throw error;
    }
}


module.exports = {
    createAReview,
    filteredAndGetPagingReviews,

}
