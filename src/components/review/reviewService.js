const Review = require("./reviewModel");
const { ObjectID } = require('mongodb');
const mongoose = require("mongoose");

const createAReview = async function (productId, userId, rating, comment) {
    try {
        if (mongoose.isValidObjectId(productId) && mongoose.isValidObjectId(userId)) {

            const review = {
                productId: new mongoose.Types.ObjectId(productId),
                userId: new mongoose.Types.ObjectId(userId),
                rating: Number(rating),
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

module.exports = {
    createAReview,

}
