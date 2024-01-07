require("dotenv").config();

// Model
const Product = require("./productModel.js");
const Review = require("../review/reviewModel.js");
const Catalog = require("../catalog/catalogModel");

// Service
const ReviewService = require("../review/reviewService.js");

const uploadToCloudinary = require("../../config/cloudinary.js");


const mongoose = require("mongoose");
const e = require("express");

const FilteredAndSortedProducts = async function (page, name, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder) {
    try {

        const filter = {};
        const sort = {};

        // filter
        if (name !== `None` && name) {
            const { Client } = require('@elastic/elasticsearch');
            const client = new Client({
                node: 'https://57727d8ffb1e48cfa43bad1822100a24.us-central1.gcp.cloud.es.io:443',
                auth: {
                    apiKey: 'MmMwRjM0d0JBdkNZdWI4T0RLa006RDBrSGk1bnNULWlyTlZGRmJ3c3pIUQ=='
                }
            });
            const searchResult = await client.search({
                index: 'search-search-product-final',
                q: name,
                _source: ["id"]
            });
            const res = searchResult.hits.hits;
            id_restriction = [];
            res.forEach(e => {
                const id = e._source;
                id_restriction.push(new mongoose.Types.ObjectId(id.id.id_content));
            });
            console.log(id_restriction);
            filter._id = { $in: id_restriction }
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
            page: parseInt(page, 10),
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
    try {
        // Get product info
        const productInfo = await Product.findById(productId);

        productInfo.view++;
        await productInfo.save();

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

        return { productInfo, relatedProducts };
    } catch (error) {
        throw error;
    }

}




const saveFileAndGetUrlFromThumbnailAndGallery = async function (files) {
    try {

        let thumbnail = null;
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
const addAProductToCart = async function (cart, productId, quantity) {

}

const getAllProduct = async function () {
    try {
        const list = await Product.find({});
        return list;
    }
    catch (error) {
        throw error;
    }
}

const getProductById = async function (productId) {
    try {
        const product = await Product.findById(productId);
        return product;
    }
    catch (error) {
        throw error;
    }
}


const updateOne = async function (id, product) {
    try {
        const catalog = await Catalog.findById(product.catalogId);
        if (catalog) {
            product.catalogName = catalog.name;
        }

        const result = await Product.findByIdAndUpdate(id, product);
        console.log(result);

        return result;
    }
    catch (error) {
        throw error;
    }
}

const takePriceOfProduct = async (productId) => {
    const product = await Product.findById(productId);
    let price = product.price * (100 - product.discount) / 100;
    return price;
}

const updateTotalPurchase = async (productId, quantity) => {
    const product = await Product.findById(productId);
    const curQuant = parseInt(product.totalPurchase, 10);
    const newQuant = curQuant + quantity;
    await Product.findByIdAndUpdate(productId, { totalPurchase: newQuant });
}

const updateProduct = async (productId, data) => {
    try {
        const product = await Product.findById(productId);

        if (data.thumbnail) {
            product.thumbnail = data.thumbnail;
        }
        if (data.gallery && data.gallery.length > 0) {
            product.gallery = data.gallery;
        }
        console.log(data);
        product.catalogId = new mongoose.Types.ObjectId(data.catalogId);
        product.name = data.name;
        product.price = (data.price);
        product.description = data.description;
        product.discount = (data.discount);
        product.status = data.status;
        product.manufacturer = data.manufacturer;

        const rs = await product.save();
        console.log(product);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}


const createProduct = async (data) => {
    try {
        const product = await Product.create(data);
        console.log(product);
        return product;
    }
    catch (err) {
    }
}

module.exports = {
    FilteredAndSortedProducts,
    getAnProductDetail,
    saveFileAndGetUrlFromThumbnailAndGallery,
    addAProductToCart,
    getAllProduct,
    getProductById,
    updateOne,
    takePriceOfProduct,
    updateTotalPurchase,
    updateProduct,
    createProduct,
}