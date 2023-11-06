const { json } = require("body-parser");
const connection = require("../config/database.js");
const { getAllUsers } = require("../services/CRUD.js");
const User = require("../model/User.js");
const { use } = require("passport");
const jwt = require("jsonwebtoken");
const { sendMail } = require("./mailApi.js")


require('dotenv').config();

const getHomePage = (req, res, next) => {
    try {
        res.render("HomePage.ejs");
    } catch (error) {
        next(error);
    }
}


const getDashBoard = (req, res, next) => {
    try {
        const user = req.user;
        res.render("DashBoard.ejs");
    }
    catch {
        next(error);
    }


}
module.exports = {
    getHomePage,
    getDashBoard,
}