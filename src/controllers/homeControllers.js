const { json } = require("body-parser");
const connection = require("../config/database.js");
const { getAllUsers } = require("../services/CRUD.js");
const User = require("../model/User.js");
const { use } = require("passport");

const getHomePage = (req, res, next) => {
    try {
        res.render("HomePage.ejs");
    } catch (error) {
        next(error);
    }
}
const postLogin = async (req, res, next) => {
    try {
        const user = req.body;
        user.latestLogin = Date.now();
        const userget = await User.findOneAndReplace({ username: `${user.username}` }, user);
        if (userget) {
            res.status(200).json({ msg: 'Found user' });
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
    postLogin
}