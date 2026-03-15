const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    createDonationRequest,
    getNGORequests,
    updateRequestStatus
} = require("../controllers/donationController");


// donor sends donation request (with image upload)
router.post("/create", upload.single("image"), createDonationRequest);


// NGO views requests sent to them
router.get("/ngo/:ngoId", getNGORequests);


// NGO approves / rejects request
router.put("/:requestId", updateRequestStatus);


module.exports = router;