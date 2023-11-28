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
const UserService = require("./userService.js");
const Jwt = require('jsonwebtoken');
const { profile } = require("console");


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
            res.render("HomePage_User.ejs", { productList: productList });
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


const getAccountProfile = async (req, res, next) => {
    try {
        const token = req.cookies['token'];
        Jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            }
            else {
                console.log(decode);
                profileData = await UserService.takeAccountProfileData(decode.id);
                console.log(profileData);
                if (profileData) {

                    res.render("AccountProfile.ejs", { user: profileData });
                }
            }
        })

    }
    catch (error) {
        next(error);
    }
}

const postAReview = async (req, res, next) => {
    try {
        const user = req.user;
        const userId = req.user._id;
        const { productId } = req.params;
        const { rating, comment } = req.body;
        console.log(req.body);
        const result = await ReviewService.createAReview(productId, userId, rating, comment);

        // Preserve the history when user write review.
        user.reviews.push(result._id);
        await user.save();

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

const patchAProductToCart = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const { productId } = req.params;
        const user = req.user;

        const result = await UserService.updateAProductToCart(user, productId, quantity);

        if (result) {
            res.status(201).json({ message: "Updated cart successfully", cart: result.cart, subTotal: result.subTotal });
        }
        else {
            res.status(400).json({ message: "Invalid data" });
        }

    } catch (error) {
        next(error);
    }
}
const getCart = async (req, res, next) => {
    try {
        const user = req.user;
        const { detailCart, subTotal } = await UserService.getDetailCart(user.cart);

        if (detailCart) {
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

const patchUserProfile = async (req, res, next) => {
    try {
        console.log(req.body);
        const token = req.cookies['token'];
        const decode = Jwt.verify(token, process.env.JWT_SECRET);
        // if(err){
        //     console.log(err.message);
        //     res.redirect('/login');
        // }
        // else{
        const response = await UserService.updateProfileData(decode.id, req.body);
        console.log(response);
        res.json({ message: response });

        // }
    } catch (error) {
        next(error);
    }
}
const checkRoleAndRedirect = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (role === "user") {
            next();
            return;
        }
        else {
            res.redirect('/admin/home-page');
        }
    } catch (error) {

    }
}

const patchAvatarProfile = async (req, res, next) => {
    try {
        if (req.file) {
            const result = await UserService.updateAvatar(req.user, req.file);
            if (result) {
                res.status(201).json({ message: "Avatar updated successfully", result });
            }
            else {
                res.status(400).json({ message: "Invalid file provided" });
            }
        }
        else {
            res.status(400).json({ message: "Invalid file provided" });
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
    patchAProductToCart,
    patchUserProfile,
    checkRoleAndRedirect,
    patchAvatarProfile
}