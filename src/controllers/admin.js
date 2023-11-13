//Service
const ProductService = require("../service/Product.js")

const getProducts = async (req, res, next) => {
    try{
        const productName = req.query.productName;
        const catalogId = req.query.catalogId;
        const minPrice = req.query.minPrice;
        const maxPrice = req.query.maxPrice;
        const manufacturer = req.query.manufacturer;
        const sortByField = req.query.sortByField;
        const sortByOrder = req.query.sortByOrder;
    
        const productList = await ProductService.PrfilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        
        if (productList) {
            res.render("AdminProducts.ejs", { productList: productList });
        }
        else {
            res.status(404).json({ message: "Load admin products failed" });
        }

    }
    catch(error){
        next(error);
    }
}


const getDashBoard = (req, res, next) => {
    try{
        res.render("DashBoardAdmin.ejs");

    }
    catch(error){
        next(error);
    }
}

const getProfile = (req, res, next) => {
    try{
        res.render("AdminProfile.ejs");

    }
    catch(error){
        next(error);
    }
}

const redirectToDashboard = (req, res, next) => {
    try{
        res.redirect("admin/dashboard");
    }
    catch(error){
        next(error);
    }
}

module.exports = {
    getProducts,
    getDashBoard,
    getProfile,
    redirectToDashboard,
}