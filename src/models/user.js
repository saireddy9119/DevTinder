const mongoose = require('mongoose');
const validator = require('validator')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Password is not strong enough")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Something went wrong")
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Url is not valid")
            }
        }
    },
    about: {
        type: String,
    },
    skills: {
        type: [String],
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)