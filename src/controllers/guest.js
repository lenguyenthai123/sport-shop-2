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
        // Set up cookie cart for guest

        if (!("cart" in req.cookies)) {
            const cartData = {
                cart: [
                    {
                        productId: "654ec268d07c800c873d0b99",
                        quantity: 10,
                    },
                    {
                        productId: "654ec268d07c800c873d0b9a",
                        quantity: 8,
                    },
                    {
                        productId: "654ec268d07c800c873d0b9b",
                        quantity: 2,
                    },
                ]
            };

            res.cookie("cart", JSON.stringify(cartData), {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
            });
        }


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

const getCart = async (req, res, next) => {
    try {

        const { cart } = JSON.parse(req.cookies.cart);

        const detailCart = await ProductService.getProductByCart(cart);
        // console.log(detailCart);

        //Render Here
        res.status(200).json({ detailCart });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    getHomePage,
    getDashBoard,
    redirectHomePage,
    getProductDetail,
    getCart

}