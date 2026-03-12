const mongoose = require("mongoose");
const validator = require("validator");

const ngoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "NGO name is required"],
            trim: true,
            minlength: [3, "NGO name must be at least 3 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"]
        },

        phone: {
            type: Number,
            required: [true, "Phone number is required"]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        },

        photo: {
            type: String,
            default: ""
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("NGO", ngoSchema);