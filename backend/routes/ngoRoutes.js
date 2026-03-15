const express = require("express");
const router = express.Router();

const { registerNGO, loginNGO, getNearbyNGOs } = require("../controllers/ngoController");
// NGO registration
router.post("/register", registerNGO);

// NGO login
router.post("/login", loginNGO);

router.get("/nearby", getNearbyNGOs);

module.exports = router;