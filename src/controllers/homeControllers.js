const { json } = require("body-parser");
const connection = require("../config/database.js");
const { getAllUsers } = require("../services/CRUD.js");



module.exports = {
    getAllUser,
    postCreateNewUser,
    replaceUser,
    updateUser,
    getAllUserDeck,
    createUserDeck,
    signUp,
    signIn
}