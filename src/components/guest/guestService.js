
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mailApi.js")

const User = require("../user/userModel.js");
const Product = require("../product/productModel.js");
const mongoose = require("mongoose");


const updateAProductToCart = async function (cart, productId, quantity) {
    try {
        if (mongoose.isValidObjectId(productId) && !isNaN(quantity)) {
            let subTotal = 0;
            let pos = -1;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i]["productId"] === productId) {
                    cart[i]["quantity"] += parseInt(quantity, 10);
                    cart[i]["quantity"] = Math.max(cart[i]["quantity"], 0);
                    pos = i;
                    break;
                }
            }

            // Delete
            for (let i = cart.length - 1; i >= 0; i--) {
                if (cart[i]["quantity"] === 0) {
                    cart.splice(i, 1);
                }
            }

            // Add
            if (pos === -1 && parseInt(quantity, 10) > 0) {
                // Which mean there are no product in cart have this
                // type of product => we can eliminate the case of Delete => Case: Add new product in cart
                cart.push({ productId, quantity: parseInt(quantity, 10) });
            }

            for (let i = 0; i < cart.length; i++) {
                try {
                    const product = await Product.findById(cart[i][`productId`]);
                    const quantity = cart[i][`quantity`];
                    subTotal += product.price * quantity;
                } catch (error) {
                    console.log("Not found product");
                }
            }

            return { cart, subTotal };
        }
        else {
            return null;
        }

    } catch (error) {
        throw error;
    }
}
// Using for reference product from cart by Id
const getProductByCart = async function (cart) {
    try {
        const detailCart = [];
        let subTotal = 0;
        for (let i = 0; i < cart.length; i++) {
            try {
                const product = await Product.findById(cart[i][`productId`]);
                const quantity = cart[i][`quantity`];
                subTotal += product.price * quantity;
                detailCart.push({ product, quantity });
            } catch (error) {
                console.log("Not found product");
            }
        }
        return { detailCart, subTotal };
    } catch (error) {
        throw error;
    }
}
module.exports = {
    updateAProductToCart,
    getProductByCart
}