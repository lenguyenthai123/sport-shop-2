const { json } = require("body-parser");
const connection = require("../config/database.js");
const { getAllUsers } = require("../services/CRUD.js");


const getHomePage = (req, res, next) => {
    try {
        res.render("HomePage.ejs");
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getHomePage
}