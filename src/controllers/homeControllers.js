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
            res.redirect("/");
        }

    } catch (error) {
        next(error);

    }
}


const postLogin = async (req, res, next) => {
    try {

        console.log("in here");
        const user = req.body;
        console.log(user);
        user.latestLogin = Date.now();
        const userget = await User.findOneAndReplace({ username: `${user.username}` }, user);
        const id = userget._id;
        const username = userget.username;
        const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30s' })

        if (userget) {
            res.status(200).json({ msg: 'Found user', token });
        }
        else {
            res.status(404).json({ msg: "Not found user" });
        }
    } catch (error) {
        next(error);
    }
}



module.exports = {
    getHomePage,
    postLogin,
    getSignUp,
    postSignUp
}