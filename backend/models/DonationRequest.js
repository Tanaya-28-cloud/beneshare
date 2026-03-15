const mongoose = require("mongoose");

const donationRequestSchema = new mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Donor",
            required: true
        },

        ngo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "NGO",
            required: true
        },

        itemType: {
            type: String,
            enum: ["clothes", "food", "books", "other"],
            required: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("DonationRequest", donationRequestSchema);