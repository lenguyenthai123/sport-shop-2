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
const ReviewService = require("../review/reviewService.js");
const CatalogService = require("../catalog/catalogService.js");

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
        const page = 1; // Default

        const productList = await ProductService.FilteredAndSortedProducts(page, productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);

        console.log(productList);

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
        res.render("DashBoardAdmin.ejs");
    }
    catch {
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

const getFormCreateNewProduct = async (req, res, next) => {
    try {
        const catalogList = await CatalogService.getAllCatalog();
        res.render("CreateNewProduct.ejs", { catalogList });
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


const getFormUpdateProduct = async (req, res, next) => {
    try {
        console.log("get in here...");
        const { productId } = req.params;

        const product = await ProductService.getProductById(productId);
        console.log(product);
        if (product) {
            const catalogList = await CatalogService.getAllCatalog();
            console.log(catalogList);
            res.render("UpdateProduct.ejs", { product, catalogList });
            return;
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    catch (error) {
        console.log("Error in getFormUpdateProduct:", error);

        next(error);
    }
}

const patchAProduct = async (req, res, next) => {

    try {



        const { productId } = req.params;

        const product = {};
        console.log(req.files);
        if (req.files) {
            const { thumbnail, gallery } = await ProductService.saveFileAndGetUrlFromThumbnailAndGallery(req.files);
            if (thumbnail) {
                product.thumbnail = thumbnail;
            }
            if (gallery) {
                product.gallery = gallery;
            }
        }

        product.catalogId = new mongoose.Types.ObjectId(req.body.catalogId);
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.discount = req.body.discount;
        product.status = req.body.status;
        product.manufacturer = req.body.manufacturer;

        await ProductService.updateOne(productId, product);
        res.status(201).json({ message: "Update product successfully", product });

    }
    catch (error) {
        console.log("Xuat loi:::", error);
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
            res.render("AdminProducts.ejs", { productList: productList.docs });
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

        const page = 1;// Default


        const accountList = await UserService.FilteredAndSortedUser(page, fullname, email, registrationDate, sortByField, sortByOrder);
        console.log(accountList);
        // res.status(200).json({ accountList });
        if (accountList) {
            res.render("ViewAccountList.ejs", { accountList: accountList });
        }
        else {
            res.status(404).json({ message: "Not found" })
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getAccountPaging = async (req, res, next) => {
    try {
        const fullname = req.query.fullname || "None";
        const email = req.query.email || "None";
        const registrationDate = req.query.registrationTime || "None";
        const sortByField = req.query.sortByField || "None";
        const sortByOrder = req.query.sortByOrder || "None";
        const page = req.query.page || 1;

        const accountList = await UserService.FilteredAndSortedUser(page, fullname, email, registrationDate, sortByField, sortByOrder);
        if (accountList) {
            res.status(200).json({ accountList: accountList });
        }
        else {
            res.status(404).json({ message: "Not found" })
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}


const getAccountDetail = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        console.log(user);
        if (user) {
            res.status(200).render("ViewAccountDetail.ejs", { user: user });
        }
        else {
            res.status(404).render("404.ejs")
        }
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

const updateCatalogName = async (req, res, next) => {
    try {
        console.log("Get in here");
        const list = await ProductService.getAllProduct();
        for (let i = 0; i < list.length; i++) {
            const catalog = await Catalog.findById(list[i].catalogId);
            console.log(catalog);
            if (catalog) {
                list[i].catalogName = catalog.name;
            }
            console.log(list[i]);

            await list[i].save();
            console.log("Update successful");

        }
        res.status(200).json({ message: "Update catalog name successfully" });
    }
    catch (error) {
        next(error);
    }
}


const patchBanAnUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const ban = req.body.ban;

        const user = await UserService.getUserById(userId);

        if (user._id !== req.user._id) {
            const result = await UserService.setBanAnUser(user, ban);
            if (result) {
                console.log(ban);
                if (ban) {
                    res.status(200).json({ message: "Ban user successfully" });
                }
                else {
                    res.status(200).json({ message: "Unban user successfully" });
                }
                return;
            }
            else {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
        else {
            res.status(403).json({ message: "Can not ban your admin account" });
            return;
        }
    }
    catch (error) {
        next(error);
    }
}
const updateRatingProduct = async (req, res, next) => {
    try {
        const list = await Product.find({});
        for (let i = 0; i < list.length; i++) {
            list[i].totalReview = 0;
            await list[i].save();
            console.log(list[i]);

        }
    } catch (error) {

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
    getAccountPaging,
    getProductsForPaging,
    patchAvatarProfile,
    updateCatalogName,
    getFormUpdateProduct,
    patchAProduct,
    patchBanAnUser,
    updateRatingProduct,
}