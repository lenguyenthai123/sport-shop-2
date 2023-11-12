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

const postAnProduct = (req, res, next) => {
    try {
        console.log("herer");
        res.render("tmp.ejs");
    } catch (error) {

    }
}

module.exports = {
    postAnProduct,

}