const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
        minLength: [6, 'No less than 6 character for username'],
        unique: [true, "User name was used before!"]
    },
    password: {
        type: String,
        required: [true, "Please provide password!"],
        minLength: [6, 'No less than 6 character for password']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    role:
    {
        type: String,
        required: [true, "Please provide role"],
    }
});

module.exports = module.exports = mongoose.model('Admin', AdminSchema);;
