const { json } = require("body-parser");
const connection = require("../../config/database.js");
const mongoose = require("mongoose");

// Model
const User = require("../user/userModel.js");
const Review = require("../review/reviewModel.js");
const Catalog = require("../catalog/catalogModel.js");
const Product = require("../product/productModel.js");

//Service
const ProductService = require("../product/productService.js")
const UserService = require("../user/userService.js")


const { use } = require("passport");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mailApi.js");


require('dotenv').config();

const getHomePage = async (req, res, next) => {
    try {
        const productName = req.query.productName || "None";
        const catalogId = req.query.catalogId || "None";
        const minPrice = req.query.minPrice || "None";
        const maxPrice = req.query.maxPrice || "None";
        const manufacturer = req.query.manufacturer || "None";
        const sortByField = req.query.sortByField || "None";
        const sortByOrder = req.query.sortByOrder || "None";

        const productList = await ProductService.FilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
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
        res.render("DashBoardAdmin.ejs");
    }
    catch {
        next(error);
    }
}

const getProductDetail = async (req, res, next) => {
    try {
        res.render("ViewAccountDetail.ejs");

        // const productId = req.params.productId;

        // const { productInfo, relatedProducts, productReviews } = await ProductService.getAnProductDetail(productId);


        // if (productInfo) {

        //     // Render file in here! Pleases!!!!!!!!!


        //     res.status(200).json({ productInfo, relatedProducts, productReviews });
        // }
        // else {
        //     res.status(404).json({ message: "Not found" });
        // }
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
        const { thumbnail, gallery } = await ProductService.saveFileAndGetUrlFromThumbnailAndGallery(req.files);

        product.thumbnail = thumbnail;
        product.gallery = gallery;
        product.catalogId = new mongoose.Types.ObjectId(req.body.catalogId);
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.discount = req.body.discount;
        product.status = req.body.status;
        product.manufacturer = req.body.manufacturer;

        const newProduct = new Product(product);
        await newProduct.save();
        res.status(201).json({ message: "Create product successfully", newProduct });

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getProductList = async (req, res, next) => {
    try {
        const productName = req.query.productName || "None";
        const catalogId = req.query.catalogId || "None";
        const minPrice = req.query.minPrice || "None";
        const maxPrice = req.query.maxPrice || "None";
        const manufacturer = req.query.manufacturer || "None";
        const sortByField = req.query.sortByField || "None";
        const sortByOrder = req.query.sortByOrder || "None";

        const productList = await ProductService.FilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        if (productList) {
            res.render("AdminProducts.ejs", { productList: productList });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }

    } catch (error) {
        next(error);
    }
}

const getAccountList = async (req, res, next) => {
    try {
        const fullname = req.query.fullname || "None";
        const email = req.query.email || "None";
        const registrationDate = req.query.registrationTime || "None";
        const sortByField = req.query.sortByField || "None";
        const sortByOrder = req.query.sortByOrder || "None";

        console.log(req.query);


        const accountList = await UserService.FilteredAndSortedUser(fullname, email, registrationDate, sortByField, sortByOrder);

        // res.status(200).json({ accountList });
        res.render("ViewAccountList.ejs", { accountList: accountList });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}


const getAccountDetail = (req, res, next) => {
    try {

        res.render("ViewAccountDetail.ejs");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getAdminProfile = (req, res, next) => {
    try {

        res.render("AdminProfile.ejs");
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
    postANewProduct,
    getProductList,
    getAccountList,
    getAccountDetail,
    getAdminProfile,

}