const express = require("express");
const router = express.Router();

const { registerDonor, loginDonor } = require("../controllers/donorController");

// register donor
router.post("/register", registerDonor);

// login donor
router.post("/login", loginDonor);

module.exports = router;