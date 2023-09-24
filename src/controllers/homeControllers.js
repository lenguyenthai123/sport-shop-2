const { json } = require("body-parser");
const connection = require("../config/database.js");

const getHomeText = (req, res) => {

    // let users = []
    // connection.query(
    //     'select * from User where id=1',
    //     function (err, result, fields) {
    //         if (!err) {
    //             users = result;
    //             console.log("Inside: ", users);
    //             //res.writeHead(200, "content-type", "text/plain");
    //             res.send(JSON.stringify(users));
    //         }
    //     }
    // )
    // console.log("Outside: ", users);
    return res.render("Homepage.ejs")
}

const getHomePic = (req, res) => {
    res.render("sample.ejs");
}

const postCreateUser = (req, res) => {
    res.send("Created successfull")
    console.log(req.body);
}


module.exports = {
    getHomeText,
    getHomePic,
    postCreateUser
}