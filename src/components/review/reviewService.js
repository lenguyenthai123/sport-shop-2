const Review = require("./reviewModel");
const { ObjectID } = require('mongodb');
const mongoose = require("mongoose");

const createAReview = async function (productId, userId, rating, comment) {
    try {


        if (mongoose.isValidObjectId(productId) && mongoose.isValidObjectId(userId)) {

            const review = {
                productId: new mongoose.Types.ObjectId(productId),
                userId: new mongoose.Types.ObjectId(userId),
                rating: parseFloat(rating),
                comment,
            }
            const result = await Review.create(review);
            return result;
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
