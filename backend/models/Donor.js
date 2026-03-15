const mongoose = require("mongoose");
const validator = require("validator");

const donorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"]
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"]
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6
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

donorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);