const { json } = require("body-parser");
const connection = require("../config/database.js");
const { getAllUsers } = require("../services/CRUD.js");
const User = require("../model/User.js");
const { use } = require("passport");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const getHomePage = (req, res, next) => {
    try {
        res.render("HomePage.ejs");
    } catch (error) {
        next(error);
    }
}


const getSignUp = (req, res, next) => {
    try {
        res.render("SignUp.ejs");
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
            res.status(200).json({ message: "Created user succesfully!" });
        }
    } catch (error) {
        next(error);
    }
}


const postLogin = async (req, res, next) => {
    try {
        console.log("HEHRE")
        const user = req.body;
        console.log(user);
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
                    maxAge: 15 * 60 * 1000,
                    httpOnly: true
                });
                res.redirect("/dashboard");
            }
            else {
                res.status(400).json({ msg: `Incorrect password` });
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

const parseCookie = async (req, res, next) => {
    try {

        // Cookies that have not been signed
        console.log('Cookies: ', req.cookies)

        // Cookies that have been signed
        console.log('Signed Cookies: ', req.signedCookies)

        // req.headers.Authorization = `Bearer ${req.cookies.token}`;
        next();
    } catch (error) {
        next(error);
    }
}

const getDashBoard = (req, res, next) => {
    const user = req.user;
    console.log(user);
    res.render("DashBoard.ejs");
}
module.exports = {
    getHomePage,
    postLogin,
    getSignUp,
    postSignUp,
    getDashBoard,
    parseCookie,
    getLogout
}