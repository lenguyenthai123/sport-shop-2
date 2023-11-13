const { json } = require("body-parser");
const connection = require("../config/database.js");
const { use } = require("passport");
const jwt = require("jsonwebtoken");
const { sendMail } = require("./mailApi.js")
require('dotenv').config();

const User = require("../model/User.js");


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
        const user = req.body;
        const foundedUser = await User.findOne({ username: user.username });
        if (!foundedUser) {
            res.status(404).json({ msg: "Not found user" });
        }
        else {
            const result = await foundedUser.comparePass(user.password);
            if (result) {
                foundedUser.latestLogin = Date.now();
                await foundedUser.save();
                const token = jwt.sign({ id: foundedUser.id, username: foundedUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                const BearerToken = `Bearer ${token}`;
                res.cookie("token", token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true
                });
                // res.redirect("/dashboard");
                // res.status(200).json({ msg: "login successull" });

                // DOING AFTER LOGIN SUCCESSFULLY

                if (foundedUser.role === "admin") {
                    res.redirect("/admin/home-page");
                }
                else {
                    res.redirect("/user/home-page");
                }

            }
            else {
                res.status(401).json({ msg: `Incorrect password` });
            }
        }
    } catch (error) {
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
            const secret = process.env.JWT_SECRET + user.password;
            const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "30m" });

            const reserPasswordLink = `http://localhost:8080/reset-password?id=${user._id}&token=${token}`;

            const mailOption = {
                from: `Admin Le Nguyen Thai <lnthai21@clc.fitus.edu.vn>`,
                to: email,
                subject: "Reset Password",
                text: ``,
                html: `<h3>Dear ${user.username} </h3>, <br>
                <p>We will give user the reset link below:<br>
                ${reserPasswordLink}<br>
                access to this link reset your password.<br>
                Regrad</p>`
            }
            sendMail(mailOption).then(result => { console.log(result) }).catch(e => { console.log(e) });
            res.send("Please check your email to reset password .....");
        }

    } catch (error) {etResetPassword
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

            const secret = process.env.JWT_SECRET + user.password;
            const payload = jwt.verify(token, secret);

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
        const { password, password2 } = req.body;

        if (password !== password2) {
            res.status(400).json({ message: "New password and confirmation do not match" });
        }

        const { id, token } = req.query;

        const user = await User.findById(id);

        if (!user) {
            res.status(404).json({ message: "Not found user or id invalid!" });
        }
        else {
            const secret = process.env.JWT_SECRET + user.password;
            const payload = jwt.verify(token, secret);

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