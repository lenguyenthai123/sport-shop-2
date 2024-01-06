const { json } = require("body-parser");
const connection = require("../../config/database.js");

// Model
const User = require("../user/userModel.js");
const Review = require("../review/reviewModel.js");
const Catalog = require("../catalog/catalogModel.js");
const Product = require("./productModel.js");


//Service
const ProductService = require("./productService.js")

const { use } = require("passport");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mailApi.js")



require('dotenv').config();

const postAnProduct = (req, res, next) => {
    try {
        console.log("herer");
        res.render("tmp.ejs");
    } catch (error) {
        next(error)
    }
}

const apiProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const product = await ProductService.getProductById(productId);
        console.log(product);
        res.status(200).json(product);

    } catch (error) {
        next(error)

    }
}

module.exports = {
    postAnProduct,
    apiProduct,
}