const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{type:String, required: true},
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

const userModels = mongoose.model("User", userSchema);

module.exports = userModels