require("dotenv").config();

const Product = require("./productModel.js");
const Review = require("../review/reviewModel.js");

const uploadToCloudinary = require("../../config/cloudinary.js");


const mongoose = require("mongoose");

const FilteredAndSortedProducts = async function (page, name, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder) {
    try {

        const filter = {};
        const sort = {};

        const limit = 10;

        // filter
        if (name !== `None` && name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (catalogId !== "None" && catalogId) {
            try {
                filter.catalogId = new mongoose.Types.ObjectId(catalogId);

            } catch (error) {
                delete filter.catalogId;
                console.log("Catalog Id invalid", error);
            }
        }
        if (manufacturer !== `None` && manufacturer) {
            filter.manufacturer = manufacturer;
        }

        if (minPrice !== `None` && maxPrice !== `None` && minPrice && maxPrice) {
            minPrice = Number(minPrice);
            maxPrice = Number(maxPrice);

            if (minPrice <= maxPrice) {
                filter.price = { $gte: minPrice, $lte: maxPrice };
            }
        }

        // Sort
        if (sortByField !== `None` && sortByField) {
            sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
        }

        const options = {
            page: page,
            limit: 8,
            sort: sort,
        }

        const result = await Product.paginate(filter, options);

        return result;
    } catch (error) {
        console.log("Error in filteredAndSortedProducts of Product Services", error);
        throw error;
    }

}

const getAnProductDetail = async function (productId) {
    // const id = new mongoose.Types.ObjectId
    try {
        // Get product info
        const productInfo = await Product.findById(productId);

        // console.log(productInfo)
        //// Get related product
        // 1. Catalog
        const catalogId = new mongoose.Types.ObjectId(productInfo.catalogId);
        const catalogRelatedProductList = await Product.find({ catalogId });

        // 2. Manufacturer
        const manufacturer = productInfo.manufacturer;
        const manufacturerRelatedProductList = await Product.find({ manufacturer });
        // Combine and make the list unique
        const allRelatedProducts = [...catalogRelatedProductList, ...manufacturerRelatedProductList];
        const relatedProducts = Array.from(new Set(allRelatedProducts.map(product => product._id)))
            .map(productId => allRelatedProducts.find(product => product._id === productId));


        // Get Product Reviews
        const productReviews = await Review.find({ productId });

        return { productInfo, relatedProducts, productReviews };
    } catch (error) {
        throw error;
    }

}


// Using for reference product from cart by Id
const getProductByCart = async function (cart) {
    try {
        const result = [];
        for (let i = 0; i < cart.length; i++) {
            try {
                const product = await Product.findById(cart[i][`productId`]);
                const quantity = cart[i][`quantity`];
                result.push({ product, quantity });
            } catch (error) {
                console.log("Not found product");
            }
        }
        return result;
    } catch (error) {
        throw error;
    }
}

const saveFileAndGetUrlFromThumbnailAndGallery = async function (files) {
    try {

        let thumbnail;
        let gallery = []
        if ("thumbnail" in files) {
            const thumbnailObject = await uploadToCloudinary(files[`thumbnail`][0], 280, 280);
            thumbnail = thumbnailObject.url;

            const thumbnailGallery = await uploadToCloudinary(files[`thumbnail`][0], 450, 600);
            gallery.push(thumbnailGallery.url);
        }
        if (`gallery` in files) {
            for (let i = 0; i < files[`gallery`].length; i++) {
                const image = await uploadToCloudinary(files[`gallery`][i], 450, 600);
                gallery.push(image.url);
                // console.log(image.url);
            }
        }

        return { thumbnail, gallery };
    } catch (error) {
        console.log("Error: Save file and get url");
        throw error;
    }

}


module.exports = {
    FilteredAndSortedProducts,
    getAnProductDetail,
    getProductByCart,
    saveFileAndGetUrlFromThumbnailAndGallery,

}