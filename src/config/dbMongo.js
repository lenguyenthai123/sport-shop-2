
const mongoose = require("mongoose");
const uri = "mongodb+srv://lenguyenthai123:lenguyenthai123@cluster0.ctwm4lc.mongodb.net/03-TASK-MANAGER?retryWrites=true&w=majority";


const connection = () => {
    mongoose
        .connect(uri)
}

module.exports = connection;