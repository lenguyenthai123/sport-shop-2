const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScheme = new Schema({
    username: {
        type: String,
        required: [true, 'Error! You must fill this field!'],
        maxLength: [20, 'No more than 20 character for username'],
        minLength: [6, 'No less than 6 character for username']
    },
    password: {
        type: String,
        required: [true, "Must has password!"],
        maxLength: [20, 'No more than 20 character for username'],
        minLength: [6, 'No less than 6 character for username']
    },
    latestLogin: {
        type: Date
    }
})

module.exports = mongoose.model('User', UserScheme);