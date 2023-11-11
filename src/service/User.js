const UserScheme = require("../model/User")
const mongoose = require("mongoose");

const User = mongoose.model('User', UserScheme);


module.exports = User;