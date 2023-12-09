const { sendMail } = require("../../utils/mailApi.js")

require('dotenv').config();

const User = require("../user/userModel.js");
const UserService = require("../user/userService.js");

const { validationResult } = require("express-validator");

const crypto = require('crypto');

const getSignUp = (req, res, next) => {
    try {
        res.render("SignUp_2.ejs");
    } catch (error) {
        next(error);
    }
}
const validatorSignupOk = (req, res, next) => {
    try {
        // Verify user input
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }
        else {
            res.status(200).json({ message: "Valid" });
        }

    } catch (error) {
        next(error);
    }
}
const postSignUp = async (req, res, next) => {
    try {
        // Verify user input
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }

        // Doing next
        const user = await User.create(req.body);
        if (!user) {
            res.status(500).json({ msg: "Created user failed" });
        }
        else {
            const resultChecking = await UserService.sendActiveTokenToMail(user);

            if (resultChecking) {
                res.status(201).json({ message: "Please check your email to activate your account" });
            }
            else {
                res.status(500).json({ msg: "Created user failed" });
            }
        }
    } catch (error) {
        next(error);
    }
}

const getActivation = async (req, res, next) => {
    try {
        const { activeToken } = req.params;

        const foundedUser = await UserService.getAnUser({ activeToken, activeExpires: { $gt: Date.now() } });

        if (!foundedUser) {
            res.status(401).json({ messsage: "Invalid activation URL" });
        }
        else {
            foundedUser.active = true;
            await UserService.save(foundedUser);
            res.status(200).json({ message: "Activation account successfully" });
        }
    }
    catch (error) {
    }
}


const getLogin = (req, res, next) => {
    try {
        res.render("Login_2.ejs");

    } catch (error) {
        next(error);
    }
}

const postLogin = async (req, res, next) => {
    try {
        // Verify user input
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }

        // Doing 
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const user = req.user;

        user.latestLogin = Date.now();
        const token = await UserService.generateToken(user);
        user.token = token;

        await UserService.save(user);

        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        });

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


const getLogout = async (req, res, next) => {
    try {

        // Clear token from user session
        const user = req.user;
        user.token = "";
        await UserService.save(user);

        res.clearCookie("token");


        res.redirect("/");
    } catch (error) {

    }
}

const getForgotPassword = (req, res, next) => {
    try {
        res.render("ForgotPassword_2.ejs");
    } catch (error) {
        next(error);
    }
}
const postForgotPassword = async (req, res, next) => {
    try {
        // Verify user input
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }

        // Doing
        const { email } = req.body;

        const user = await UserService.getUserByConditions({ email: email });
        if (!user) {
            res.status(404).json({ msg: "Email is not registered" });
        }
        else {
            const resultChecking = await UserService.sendResetEmail(user);
            if (resultChecking) {
                res.status(200).send("Please check your email to reset password .....");
            }
            else {
                res.status(500).json({ message: "Error" });
            }
        }

    } catch (error) {
        // etResetPassword
        next(error)
    }
}

const getResetPassword = async (req, res, next) => {
    try {
        const { id, token } = req.query;

        const user = await UserService.getUserById(id);

        if (!user) {
            res.status(404).json({ message: "Not found" });
        }
        else {
            const payload = UserService.verifyResetToken(user, token);

            if (payload.id !== id) {
                res.status(401).json({ msg: "Invalid url to reset password" });
                return;
            }

            // Successfull because error will throw 
            res.render("ResetPassword_2.ejs", { email: user.email })
            return;
        }
    } catch (error) {
        next(error);
    }
}
const postResetPassword = async (req, res, next) => {
    try {
        // Verify user input
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(400).json({ errors: result.array() });
            return;
        }

        // Doing next thing
        const { password, passwordConfirmation } = req.body;

        const { id, token } = req.query;

        const user = await UserService.getUserById(id);

        if (!user) {
            res.status(404).json({ message: "Not found user or id invalid!" });
            return;
        }
        else {
            const payload = UserService.verifyResetToken(user, token);

            if (payload.id !== id) {
                res.status(401).json({ message: "Invalid url to reset password!" });
                return;
            }

            user.password = password;
            await UserService.save(user);

            res.status(200).send("Change password successfully!");
            return;
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
        // Verify user input
        const resultValidator = validationResult(req);

        if (!resultValidator.isEmpty()) {
            res.status(400).json({ errors: resultValidator.array() });
            return;
        }

        const { password, newPassword, passwordConfirmation } = req.body;

        const user = req.user;

        const result = await user.comparePass(password);
        if (result) {
            if (newPassword !== passwordConfirmation) {
                res.status(400).json({ message: "New password and confirmation do not match" });
                return;
            }

            user.password = newPassword;
            await UserService.save(user);

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
    validatorSignupOk,
    getActivation,
}