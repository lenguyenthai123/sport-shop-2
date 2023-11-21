
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mailApi.js")

const User = require("../user/userModel.js");
const mongoose = require("mongoose");


const addAProductToCart = function (cart, productId, quantity) {
    try {
        if (mongoose.isValidObjectId(productId) && !isNaN(quantity)) {

            let pos = -1;
            for (let i = 0; i < cart.length; i++) {
                if (cart[i]["productId"] === productId) {
                    cart[i]["quantity"] += parseInt(quantity, 10);
                    cart[i]["quantity"] = Math.max(cart[i]["quantity"], 0);
                    pos = i;
                    break;
                }
            }
            if (pos === -1) {
                cart.push({ productId, quantity: parseInt(quantity, 10) });
            }
            return cart;
        }
        else {
            return null;
        }

    } catch (error) {
        throw error;
    }
}

module.exports = {
    addAProductToCart,
}