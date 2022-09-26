const dbConfig = require('../../db/dbConfig');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    age: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        min: 10,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already present"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    OTP: {
        type: Number,
        unique: true
    },
    verifyOTP: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true });


module.exports = mongoose.model('users', userSchema);
