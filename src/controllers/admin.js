const { json } = require("body-parser");
const connection = require("../config/database.js");
const mongoose = require("mongoose");

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

const getProductDetail = async (req, res, next) => {
    try {

        const productId = req.params.productId;

        const { productInfo, relatedProducts, productReviews } = await ProductService.getAnProductDetail(productId);


        if (productInfo) {

            // Render file in here! Pleases!!!!!!!!!

            res.status(200).json({ productInfo, relatedProducts, productReviews });
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

const getFormCreateNewProduct = (req, res, next) => {
    try {

        res.render("CreateNewProduct.ejs");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}



const postANewProduct = async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        const product = {};

        if ("thumbnail" in req.files) {
            const thumbnailList = await ProductService.saveFileAndGetUrl(req.files[`thumbnail`]);
            product.thumbnail = thumbnailList[0];

        }
        if (`gallery` in req.files) {

            const galleryList = await ProductService.saveFileAndGetUrl(req.files[`gallery`]);
            product.gallery = [...galleryList];
        }

        product.catalogId = new mongoose.Types.ObjectId(req.body.catalogId);
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.discount = req.body.discount;
        product.creationTime = req.body.creationTime;
        product.view = req.body.view;
        product.totalPurchase = req.body.totalPurchase;
        product.status = req.body.status;
        product.manufacturer = req.body.manufacturer;


        const newProduct = new Product(product);
        await newProduct.save();
        res.status(201).json(newProduct);

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = {
    getHomePage,
    getDashBoard,
    getProductDetail,
    getFormCreateNewProduct,
    postANewProduct

}