
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utils/mailApi.js")

const User = require("./userModel.js");
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

const addAProductToCart = async function (user, productId, quantity) {
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
            if (pos === -1) {
                user.cart.push({ productId: objectProductId, quantity: parseInt(quantity, 10) });
            }
            await user.save();
            return user;
        }
        else {
            return null;
        }

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
    addAProductToCart,
}