
const mongoose = require("mongoose");
const uri = "mongodb://localhost/practice-project";


const connection = () => {
    mongoose
        .connect(uri)
        .then(() => console.log("Connected to server"))
        .catch((error) => console.error(`Connected failure ${error}`))
}

module.exports = connection;