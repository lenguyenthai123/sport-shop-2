const { json } = require("body-parser");

const { use } = require("passport");
const jwt = require("jsonwebtoken");

const { sendMail } = require("../../utils/mailApi.js")

require('dotenv').config();

const User = require("../user/userModel.js");
const UserService = require("../user/userService.js");


const getSignUp = (req, res, next) => {
    try {
        res.render("SignUp_1.ejs");
    } catch (error) {
        next(error);
    }
}

const postSignUp = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        if (!user) {
            res.status(500).json({ msg: "Created user failed" });
        }
        else {
            res.status(201).json({ message: "Created user succesfully!" });
        }
    } catch (error) {
        next(error);
    }
}

const getLogin = (req, res, next) => {
    try {
        res.render("Login_1.ejs");
    } catch (error) {
        next(error);
    }
}

const postLogin = async (req, res, next) => {
    try {

        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = req.user;
        console.log(user);
        user.latestLogin = Date.now();

        await user.save();
        const token = await UserService.generateToken(user);

        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        });
        // res.redirect("/dashboard");
        // res.status(200).json({ msg: "login successull" });

        // DOING AFTER LOGIN SUCCESSFULLY

        if (user.role === "admin") {
            res.redirect(302, "/admin/dashboard");

        }
        else {
            res.redirect(302, "/user/home-page");
        }

    }
    catch (error) {
        next(error);
    }
}


const getLogout = (req, res, next) => {
    try {
        res.cookie("token", "", {
            maxAge: -1,
            httpOnly: true
        });
        res.redirect("/");
    } catch (error) {

    }
}

const getForgotPassword = (req, res, next) => {
    try {
        res.render("ForgotPassword_1.ejs");
    } catch (error) {
        next(error);
    }
}
const postForgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email);

        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404).json({ msg: "Email này không tồn tại" });
        }
        else {
            const token = await UserService.generateResetToken(user);

            const resetPasswordLink = `${process.env.WEBSITE_URL}/reset-password?id=${user._id}&token=${token}`;

            await UserService.sendResetEmail(user.email, user.username, resetPasswordLink);

            res.send("Please check your email to reset password .....");
        }

    } catch (error) {
        // etResetPassword
        next(error)
    }
}

const getResetPassword = async (req, res, next) => {
    try {
        const { id, token } = req.query;

        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ message: "Not found" });
        }
        else {
            const payload = UserService.verifyResetToken(user, token);

            if (payload.id !== id) {
                res.status(401).json({ msg: "Invalid token or id" });
            }

            // Successfull because error will throw 
            res.render("ResetPassword_1.ejs", { email: user.email })
        }
    } catch (error) {
        next(error);
    }
}
const postResetPassword = async (req, res, next) => {
    try {
        console.log("Here");
        const { password, confirmedPassword } = req.body;

        if (password !== confirmedPassword) {
            res.status(400).json({ message: "New password and confirmation do not match" });
        }

        const { id, token } = req.query;

        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ message: "Not found user or id invalid!" });
        }
        else {
            const payload = UserService.verifyResetToken(user, token);

            if (payload.id !== user.id) {
                res.status(401).json({ message: "Id invalid or token invalid" });
            }

            user.password = password;
            await user.save();

            res.status(200).send("Change password successfully!");
        }

    } catch (error) {
        next(error);
    }
}

const getUpdatePassword = async (req, res, next) => {
    try {

        res.render("UpdatePassword.ejs");
    } catch (error) {
    }
}

const postUpdatePassword = async (req, res, next) => {
    try {

        const { password, newPassword, confirmPassword } = req.body;

        const user = req.user;

        const result = await user.comparePass(password);
        if (result) {
            if (newPassword !== confirmPassword) {
                res.status(400).json({ message: "New password and confirmation do not match" });
                return;
            }

            user.password = newPassword;
            await user.save();

            res.cookie("token", "", {
                maxAge: -1,
                httpOnly: true
            });
            res.status(200).json({ message: "Password updated successfully! Please login again!" });

        }
        else {
            res.status(401).json({ message: "Current password is incorrect" });
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSignUp,
    postSignUp,
    getLogin,
    postLogin,
    getLogout,
    getForgotPassword,
    postForgotPassword,
    getResetPassword,
    postResetPassword,
    getUpdatePassword,
    postUpdatePassword,
}