const express = require("express");
const router = express.Router();

const { registerNGO, loginNGO } = require("../controllers/ngoController");

// NGO registration
router.post("/register", registerNGO);

// NGO login
router.post("/login", loginNGO);

module.exports = router;