const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScheme = new Schema({
    username: {
        type: String,
        required: [true, 'Error! You must fill this field!'],
        minLength: [6, 'No less than 6 character for username']
    },
    password: {
        type: String,
        required: [true, "Must has password!"],
        minLength: [6, 'No less than 6 character for password']
    },
    email: {
        type: String,
        required: [true, "Must has email!"],
        minLength: [6, 'No less than 6 character for email']
    },
    dateofbirth: {
        type: Date
    },
    createdAcc: {
        type: Date,
        default: Date.now()
    },
    latestLogin: {
        type: Date
    }
})

module.exports = mongoose.model('User', UserScheme);