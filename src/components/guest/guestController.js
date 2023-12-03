const { json } = require("body-parser");
const connection = require("../../config/database.js");

// Model
const User = require("../user/userModel.js");
const Review = require("../review/reviewModel.js");
const Catalog = require("../catalog/catalogModel.js");
const Product = require("../product/productModel.js");

//Service
const ProductService = require("../product/productService.js")
const ReviewService = require("../review/reviewService.js")
const GuestService = require("./guestService.js");


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
        const page = req.query.page; //Default;

        const productList = await ProductService.FilteredAndSortedProducts(page, productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);

        res.render("Homepage_1.ejs", { productList: productList, isLoggedIn: false });
    }
    catch {
        next(error);
    }
}

const getAllProductPage = async (req, res, next) => {
    try {
        // Set up cookie cart for guest

        if (!("cart" in req.cookies)) {
            const cartData = {
                cart: [
                    {
                        productId: "6551ec89ffd25c65836c66da",
                        quantity: 10,
                    },
                    {
                        productId: "6551ed09ffd25c65836c66dd",
                        quantity: 8,
                    },
                    {
                        productId: "6551eec1fe81b65860274bc3",
                        quantity: 2,
                    },
                ],
            };

            res.cookie("cart", JSON.stringify(cartData), {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
            });
        }


        const productName = req.query.productName || "None";
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;
        const page = req.query.page; //Default;

        const productList = await ProductService.FilteredAndSortedProducts(page, productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        if (productList) {
            res.render("AllProduct.ejs", { productList: productList, isLoggedIn: false });
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
        console.log("paging guest")
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

const getProductDetailPage = async (req, res, next) => {
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

const getProductDetailInfo = async (req, res, next) => {
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

// Chú ý trong việc frontend =!!!!!!!!!!!!
const patchAProductToCart = async (req, res, next) => {
    try {
        const { cart } = JSON.parse(req.cookies.cart);
        const { quantity } = req.body;
        const { productId } = req.params;
        const result = await GuestService.updateAProductToCart(cart, productId, quantity);

        if (result) {
            res.cookie("cart", JSON.stringify({ cart: result.cart }), {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: false,
            });

            res.status(201).json({ message: "Updated cart successfully", cart: result.cart, subTotal: result.subTotal });
        }
        else {
            res.status(400).json({ message: "Invalid data" });
        }
    }
    catch (error) {
        next(error);
    }
}

const getCart = async (req, res, next) => {
    try {
        const { cart } = JSON.parse(req.cookies.cart);
        const { detailCart, subTotal } = await GuestService.getProductByCart(cart);

        if (detailCart) {
            // res.render("CartPage.ejs");
            //Render Here
            res.status(200).json({ cart: detailCart, subTotal });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    catch (error) {
        next(error);
    }
}

const getCartPage = async (req, res, next) => {
    try {
        const { cart } = JSON.parse(req.cookies.cart);
        const { detailCart, subTotal } = await GuestService.getProductByCart(cart);

        if (detailCart) {
            res.render("CartPage.ejs");
            //Render Here
            // res.status(200).json({ cart: detailCart, subTotal });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
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

const checkRoleAndRedirect = (req, res, next) => {
    try {
        // if (!req.cookies.token) {
        //     next();
        //     return;
        // }
        // else {
        //     res.redirect("/user/home-page");
        //     return;
        // }
    }
    catch (error) {
        next(error)
    }
}


const checkRoleAndRedirectAllProduct = (req, res, next) => {
    try {
        if (!req.cookies.token) {
            next();
            return;
        }
        else {
            res.redirect("/user/all-product");
            return;
        }
    }
    catch (error) {
        next(error)
    }
}

const checkRoleAndRedirectCart = (req, res, next) => {
    try {
        if (!req.cookies.token) {
            next();
            return;
        }
        else {
            res.redirect("/user/cart");
            return;
        }
    }
    catch (error) {
        next(error)
    }
}


module.exports = {
    getHomePage,
    getAllProductPage,
    getDashBoard,
    redirectHomePage,
    getProductDetailPage,
    getCart,
    getAccountProfile,
    getProductsForPaging,
    getReviewsForPaging,
    patchAProductToCart,
    checkRoleAndRedirect,
    checkRoleAndRedirectAllProduct,
    checkRoleAndRedirectCart,
    getProductDetailInfo,

}