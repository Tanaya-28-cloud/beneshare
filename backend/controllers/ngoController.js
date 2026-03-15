const NGO = require("../models/NGO");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
const registerNGO = async (req, res) => {
    try {

        const { name, email, phone, password, location } = req.body;

        // validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // check if NGO already exists
        const existingNGO = await NGO.findOne({ email });

        if (existingNGO) {
            return res.status(400).json({
                message: "NGO already registered with this email"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const ngo = new NGO({
            name,
            email,
            phone,
            password: hashedPassword,
            location
        });

        await ngo.save();

        res.status(201).json({
            message: "NGO registered successfully",
            ngo: {
                id: ngo._id,
                name: ngo.name,
                email: ngo.email,
                phone: ngo.phone
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// LOGIN
const loginNGO = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const ngo = await NGO.findOne({ email });

        if (!ngo) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, ngo.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: ngo._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            ngo: {
                id: ngo._id,
                name: ngo.name,
                email: ngo.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// FIND NEARBY NGOs
const getNearbyNGOs = async (req, res) => {
    try {

        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        const ngos = await NGO.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 10000 // 10 km
                }
            }
        }).select("name email phone location");

        res.json({
            count: ngos.length,
            ngos
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    registerNGO,
    loginNGO,
    getNearbyNGOs
};


