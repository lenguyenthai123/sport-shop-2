
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mailApi.js")

const User = require("./userModel.js");
const Product = require("../product/productModel.js");

const mongoose = require("mongoose");


const generateResetToken = async function (user) {
    const secret = process.env.JWT_SECRET + user.password;
    return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "30m" });
}
const verifyResetToken = async function (user, token) {

    try {
        const secret = process.env.JWT_SECRET + user.password;
        const payload = jwt.verify(token, secret);

        return payload;
    } catch (error) {
        throw error;
    }
}

const generateToken = async function (user) {
    try {
        return await jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    } catch (error) {
        throw error;
    }
}

const sendResetEmail = async function (email, username, resetLink) {
    try {
        const mailOption = {
            from: `Admin Le Nguyen Thai <lnthai21@clc.fitus.edu.vn>`,
            to: email,
            subject: "Reset Password",
            text: ``,
            html: `<h3>Dear ${username} </h3>, <br>
                <p>We will give user the reset link below:<br>
                ${resetLink}<br>
                access to this link reset your password.<br>
                Regards</p>`
        };
        return sendMail(mailOption);
    } catch (error) {
        throw error;
    }

}

const FilteredAndSortedUser = async function (page, fullname, email, sortByField, sortByOrder) {
    try {
        const filter = {};
        const sort = {};

        // Fliter
        if (fullname !== `None` && fullname) {
            filter.fullname = { $regex: fullname, $options: "i" };
        }

        if (email !== `None` && email) {
            filter.email = { $regex: email, $options: "i" };
        }

        // Sort
        if (sortByField !== `None` && sortByField) {
            sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
        }

        const options = {
            page: page,
            limit: 10,
            sort: sort,
        }

        const result = await User.paginate(filter, options);

        return result;
    } catch (error) {
        console.log("Error in filteredAndSortedProducts of User Services", error);
        throw error;
    }
}

const updateAProductToCart = async function (user, productId, quantity) {
    try {

        if (mongoose.isValidObjectId(productId) && !isNaN(quantity)) {
            const objectProductId = new mongoose.Types.ObjectId(productId);
            let pos = -1;
            for (let i = 0; i < user["cart"].length; i++) {

                if (user["cart"][i]["productId"].equals(objectProductId)) {
                    user["cart"][i]["quantity"] += parseInt(quantity, 10);
                    user["cart"][i]["quantity"] = Math.max(user["cart"][i]["quantity"], 0);
                    pos = i;
                    break;
                }
            }

            // Delete
            for (let i = user["cart"].length - 1; i >= 0; i--) {
                if (user["cart"][i]["quantity"] === 0) {
                    user["cart"].splice(i, 1);
                }
            }

            // Add
            if (pos === -1 && parseInt(quantity, 10) > 0) {
                user.cart.push({ productId: objectProductId, quantity: parseInt(quantity, 10) });
            }

            let subTotal = 0;
            for (let i = 0; i < user.cart.length; i++) {
                try {
                    const product = await Product.findById(user.cart[i][`productId`]);
                    const quantity = user.cart[i][`quantity`];
                    subTotal += product.price * quantity;
                } catch (error) {
                    console.log("Not found product");
                }
            }

            await user.save();
            return { cart: user.cart, subTotal };
        }
        else {
            return null;
        }

    } catch (error) {
        throw error;
    }
}

const getDetailCart = async function (cart) {
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

const takeAccountProfileData = async function (id){
    try {
        let profile = await User.findById(id);
        return profile;
    } catch (error) {
        throw error;
    }
}

const updateProfileData = async function (id, updateData){
    try {
        await User.findByIdAndUpdate(id, updateData);
        await User.updateMany({}, {avatar: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"});
        return "Update successfully";
    } catch (error) {
        throw error;
    }
}

module.exports = {
    generateResetToken,
    sendResetEmail,
    generateToken,
    verifyResetToken,
    FilteredAndSortedUser,
    updateAProductToCart,
    getDetailCart,
    takeAccountProfileData,
    updateProfileData,
}