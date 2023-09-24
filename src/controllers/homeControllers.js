const { json } = require("body-parser");
const connection = require("../config/database.js");
const { getAllUsers } = require("../services/CRUD.js");

const getHomeText = async (req, res) => {
    const result = await getAllUsers();
    return res.render("Homepage.ejs", { listUsers: result })
}

const getHomePic = (req, res) => {
    res.render("sample.ejs");
}

// const postCreateUser = async (req, res) => {
//     let { email, name, city } = req.body;
//     console.log("email=", email)
//     console.log("name=", name)
//     console.log("city=", city)
//     let [result, fields] = await connection.query(`insert into User(email,name,city) values (?, ?, ?)`, [email, name, city]
//     );
//     res.send("Add an user successfull");
//     return;
// }

const postCreateUser = async (req, res) => {
    try {
        let { email, name, city } = req.body;
        console.log("email=", email)
        console.log("name=", name)
        console.log("city=", city)
        let [result, fields] = await connection.query(
            `insert into User(email, name, city) values (?, ?, ?)`,
            [email, name, city]
        );
        res.send("Add an user successful");
    } catch (error) {
        console.error('Query error:', error);
        res.status(500).send("An error occurred while adding the user");
    }
}

const getCreateForm = (req, res) => {
    res.render("Create.ejs");
}



module.exports = {
    getHomeText,
    getHomePic,
    postCreateUser,
    getCreateForm
}