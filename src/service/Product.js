const Product = require("../model/Product.js");
const Review = require("../model/Review.js");

const mongoose = require("mongoose");

const PrfilteredAndSortedProducts = async function (name, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder) {
    const fliter = {};
    const sort = {};

    // Fliter
    if (name !== `None` && name) {
        fliter.name = name;
    }
    if (catalogId !== "None" && catalogId) {
        try {
            fliter.catalogId = new mongoose.Types.ObjectId(catalogId);

        } catch (error) {
            delete fliter.catalogId;
            console.log("Catalog Id invalid", error);
        }
    }
    if (manufacturer !== `None` && manufacturer) {
        fliter.manufacturer = manufacturer;
    }

    if (minPrice !== `None` && maxPrice !== `None` && minPrice && maxPrice) {
        minPrice = Number(minPrice);
        maxPrice = Number(maxPrice);

        if (minPrice <= maxPrice) {
            fliter.price = { $gte: minPrice, $lte: maxPrice };
        }
    }

    // Sort
    if (sortByField !== `None` && sortByField) {
        sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
    }

    try {
        const result = await Product.find(fliter).sort(sort);

        return result;
    } catch (error) {
        console.log("Error in PrfilteredAndSortedProducts of Product Services", error);
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

module.exports = {
    PrfilteredAndSortedProducts,
    getAnProductDetail,
    getProductByCart

}