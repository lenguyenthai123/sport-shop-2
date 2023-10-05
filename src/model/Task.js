const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Must have value'],
        maxLength: [20, "Can not exceed 20 character"],
        trim: true
    }
    , completed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Task", TaskSchema);

