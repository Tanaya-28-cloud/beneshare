const Donor = require("../models/Donor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER DONOR
const registerDonor = async (req, res) => {
    try {

        const { name, email, phone, password, location } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingDonor = await Donor.findOne({ email });

        if (existingDonor) {
            return res.status(400).json({
                message: "Donor already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const donor = new Donor({
            name,
            email,
            phone,
            password: hashedPassword,
            location
        });

        await donor.save();

        res.status(201).json({
            message: "Donor registered successfully",
            donor: {
                id: donor._id,
                name: donor.name,
                email: donor.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// LOGIN DONOR
const loginDonor = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const donor = await Donor.findOne({ email });

        if (!donor) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, donor.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: donor._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            donor: {
                id: donor._id,
                name: donor.name,
                email: donor.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    registerDonor,
    loginDonor
};