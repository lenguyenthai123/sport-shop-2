const { json } = require("body-parser");
const connection = require("../config/database.js");

const getHomeText = (req, res) => {

    let users = []
    connection.query(
        'select * from User where id=2',
        function (err, result, fields) {
            if (!err) {
                users = result;
                console.log("Inside: ", users);
                //res.writeHead(200, "content-type", "text/plain");
                //res.send(JSON.stringify(users));
            }
        }
    )
    console.log("Outside: ", users);
    return res.render("Homepage.ejs")
}

const getHomePic = (req, res) => {
    res.render("sample.ejs");
}

const postCreateUser = (req, res) => {
    let { email, name, city } = req.body;
    console.log("email=", email)
    console.log("name=", name)
    console.log("city=", city)
    connection.query(
        `insert into User(email,name,city)
        values (?, ?, ?)`,
        [email, name, city],
        function (err, result) {
            //console.log(result);
            res.send("Add user successfull!");
            if (err) {
                console.log(err);
            }
        }
    )
}


module.exports = {
    getHomeText,
    getHomePic,
    postCreateUser
}