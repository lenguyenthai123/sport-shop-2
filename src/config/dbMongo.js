
const mongoose = require("mongoose");
const uri = "mongodb+srv://lenguyenthai123:g76a1zu6pJwBRLFy@cluster0.ctwm4lc.mongodb.net/Hotel?retryWrites=true&w=majority";


const connection = () => {
    mongoose
        .connect(uri)
        .then(() => console.log("Connected to server"))
        .catch((error) => console.error(`Connected failure ${error}`))
}

module.exports = connection;