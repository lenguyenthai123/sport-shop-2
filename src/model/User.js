const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")
const UserScheme = new Schema({
    username: {
        type: String,
        required: [true, 'Error! You must fill this field!'],
        minLength: [6, 'No less than 6 character for username'],
        unique: [true, "User name was used before!"]
    },
    password: {
        type: String,
        required: [true, "Must has password!"],
        minLength: [6, 'No less than 6 character for password']
    },
    email: {
        type: String,
        required: [true, "Must has email!"],
        minLength: [6, 'No less than 6 character for email'],
        unique: [true, "Email was used before!"]
    },
    dateofbirth: {
        type: Date
    },
    createdAcc: {
        type: Date,
        default: Date.now()
    },
    latestLogin: {
        type: Date,
        default: Date.now()

    }
})

UserScheme.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

UserScheme.methods.comparePass = async function (temporaryPassword) {
    const result = await bcrypt.compare(temporaryPassword, this.password);
    return result;
}

module.exports = mongoose.model('User', UserScheme);