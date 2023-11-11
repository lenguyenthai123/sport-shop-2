const { json } = require("body-parser");
const connection = require("../config/database.js");

// Model
const User = require("../model/User.js");
const Review = require("../model/Review.js");
const Product = require("../model/Product.js");
const Catalog = require("../model/Catalog.js");

//Service
const ProductService = require("../service/Product.js")

const { use } = require("passport");
const jwt = require("jsonwebtoken");
const { sendMail } = require("./mailApi.js")


require('dotenv').config();

const getHomePage = async (req, res, next) => {
    try {
        const productName = req.query.productName;
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;

        const productList = await ProductService.PrfilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
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


const getDashBoard = (req, res, next) => {
    try {
        const user = req.user;
        res.render("DashBoard.ejs");
    }
    catch {
        next(error);
    }
}
const redirectHomePage = (req, res, next) => {
    try {
        res.redirect("/home-page");
    }
    catch (error) {
        next(error);
    }
}

const getProductDetail = async (req, res, next) => {
    try {

        const productId = req.params.productId;

        const { productInfo, relatedProducts, productReviews } = await ProductService.getAnProductDetail(productId);


        if (productInfo) {

            res.status(200).json({ productInfo });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}


module.exports = {
    getHomePage,
    getDashBoard,
    redirectHomePage,
    getProductDetail

}