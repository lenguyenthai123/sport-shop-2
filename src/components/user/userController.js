const { json } = require("body-parser");
const connection = require("../../config/database.js");

// Model
const User = require("./userModel.js");
const Review = require("../review/reviewModel.js");
const Catalog = require("../catalog/catalogModel.js");
const Product = require("../product/productModel.js");

//Service
const ProductService = require("../product/productService.js")
const ReviewService = require("../review/reviewService.js")


require('dotenv').config();

const getHomePage = async (req, res, next) => {
    try {
        const productName = req.query.productName || "None";
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;
        const page = 1; //Default;

        const productList = await ProductService.FilteredAndSortedProducts(page, productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        if (productList) {
            res.render("HomePage_1.ejs", { productList: productList });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }

    } catch (error) {
        next(error);
    }
}


const getProductsForPaging = async (req, res, next) => {
    try {
        const productName = req.query.productName || "None";
        const catalogId = req.query.catalogId || "None";
        const minPrice = req.query.minPrice || 0;
        const maxPrice = req.query.maxPrice || 0;
        const manufacturer = req.query.manufacturer || "None";
        const sortByField = req.query.sortByField || "None";
        const sortByOrder = req.query.sortByOrder || "None";
        const page = req.query.page || 1;

        const productList = await ProductService.FilteredAndSortedProducts(page, productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        console.log(productList)

        if (productList) {
            res.status(200).json({ productList: productList });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }

    } catch (error) {
        next(error);
    }
}



const getProductDetail = async (req, res, next) => {
    try {

        const productId = req.params.productId || "None";
        const { productInfo, relatedProducts } = await ProductService.getAnProductDetail(productId);
        const reviews = await ReviewService.filteredAndGetPagingReviews(productId, 1); // Default 1 when init.

        if (productInfo) {

            // Render file in here! Pleases!!!!!!!!!

            res.status(200).json({ productInfo, relatedProducts, reviews });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

// paging
const getReviewsForPaging = async (req, res, next) => {
    try {

        const productId = req.params.productId || "None";
        const page = req.query.page || 1;
        const reviews = await ReviewService.filteredAndGetPagingReviews(productId, page);

        if (reviews) {
            res.status(200).json({ reviews });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getCart = async (req, res, next) => {
    try {

        // Doing again
    }
    catch (error) {
        next(error);
    }
}

const getAccountProfile = (req, res, next) => {
    try {
        res.render("AccountProfile.ejs")
    }
    catch (error) {
        next(error);
    }
}

const postAReview = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { rating, comment } = req.body;
        console.log(req.body);
        const result = await ReviewService.createAReview(productId, userId, rating, comment);

        if (result) {
            res.status(201).json({ message: "Create successfully", data: result });
        }
        else {
            res.status(400).json({ message: "Invalid data provided" });
        }
    } catch (error) {
        next(error);
    }
}



module.exports = {
    getHomePage,
    getProductDetail,
    getCart,
    getAccountProfile,
    getProductsForPaging,
    postAReview,
    getReviewsForPaging,

}