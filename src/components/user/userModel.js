const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs")
const UserScheme = new Schema({
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
        // required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        // unique: true,
    },
    fullname: {
        type: String,
        maxLength: 20,
        default: "full name",
        trim: true,
    },
    avatar: {
        type: String,
        default: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
    },

    address: {
        type: String,
        trim: true,
        default: "Null",
    },

    dateOfBirth: {
        type: Date,
        default: Date.now(),
    },
    country: {
        type: String,
        trim: true,
        default: "Vietnam",
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    activation: {
        type: Boolean,
        default: false,
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    latestAccess: {
        type: Date,
        default: Date.now()

    },
    googleId: {
        type: String,
        default: null,
    },
    facebookId: {
        type: String,
        default: null,
    },
    provider: {
        type: String,
        default: null,
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: `Product`,
            },
            quantity: Number
        }
    ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: `Review`,
        }
    ],
    ban: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "user",
    },
    active: {
        type: Boolean,
        default: false
    },
    activeToken: String,
    activeExpires: Date,
    token: {
        type: String,
        default: "token",
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

UserScheme.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserScheme);