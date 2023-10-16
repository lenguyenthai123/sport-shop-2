const mongoose = require("mongoose");
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'Phai co first name'],
        maxLength: [20, 'Not exceed 20 character'],
        minLength: [4, 'Min is 4 character']
    },
    lastName: {
        type: String,
        required: [true, 'Phai co last name'],
        maxLength: [20, 'Not exceed 20 character'],
        minLength: [4, 'Min is 4 character']
    },
    email: {
        type: String,
        required: [true, 'Must provided email'],
        maxLength: [20, 'Not exceed 20 character'],
        minLength: [4, 'Min is 4 character'],
        unique: true,
        index: true
    },
    deck: [{
        type: Schema.Types.ObjectId,
        ref: `Deck`
    }]
})


module.exports = mongoose.model("User", UserSchema);