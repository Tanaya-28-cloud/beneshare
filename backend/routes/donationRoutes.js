const express = require("express");
const router = express.Router();

const {
    createDonationRequest,
    getNGORequests,
    updateRequestStatus
} = require("../controllers/donationController");

// donor sends donation request
router.post("/create", createDonationRequest);

// NGO views requests sent to them
router.get("/ngo/:ngoId", getNGORequests);

// NGO approves / rejects request
router.put("/:requestId", updateRequestStatus);

module.exports = router;