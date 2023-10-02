const { json } = require("body-parser");
const connection = require("../config/database.js");
const { getAllUsers } = require("../services/CRUD.js");

const getHomeText = async (req, res) => {
    const result = await getAllUsers();
    return res.render("HomePageCopy.ejs", { listUsers: result })
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

const getUpdate = async (req, res) => {
    const usernumber = Number(req.params.userNumber)

    const allUser = await getAllUsers();
    const User = allUser[usernumber];
    res.render("Update.ejs", { user: User, userNumber: usernumber });
}

const postUpdated = async (req, res) => {
    console.log("in updateing database");

    const { email, name, city } = req.body;
    const userID = Number(req.params.userNumber);
    console.log(">>> ID::::::::", userID);
    let [result, fields] = await connection.query("update User set email=? , name=? , city=? where id=?", [email, name, city, userID]);

    console.log(result);
    res.send("Updated successfull");

}
const postDelete = async (req, res) => {
    const userID = Number(req.params.userNumber);

    let [result, fields] = await connection.query("delete from User where id = ?", [userID]);

    console.log(result);
    if (result != null) {
        res.send("Delete successfully!");
    }
    else {
        res.send("Delete fails");
    }
    return;
}

const getSearch = (req, res) => {
    res.render("Search.ejs")
}

const postSearchItem = (req, res) => {

}
module.exports = {
    getHomeText,
    getHomePic,
    postCreateUser,
    getCreateForm,
    getUpdate,
    postUpdated,
    postDelete,
    getSearch,
    postSearchItem
}