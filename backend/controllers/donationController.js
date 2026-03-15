const DonationRequest = require("../models/DonationRequest");


// CREATE DONATION REQUEST (Donor)
const createDonationRequest = async (req, res) => {
    try {

        const { donorId, ngoId, itemType, description, image } = req.body;

        if (!donorId || !ngoId || !itemType || !description) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const request = new DonationRequest({
            donor: donorId,
            ngo: ngoId,
            itemType,
            description,
            image
        });

        await request.save();

        res.status(201).json({
            message: "Donation request created",
            request
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL REQUESTS FOR NGO
const getNGORequests = async (req, res) => {
    try {

        const { ngoId } = req.params;

        const requests = await DonationRequest.find({ ngo: ngoId })
            .populate("donor", "name email phone");

        res.json(requests);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// UPDATE REQUEST STATUS (Approve / Reject)
const updateRequestStatus = async (req, res) => {
    try {

        const { requestId } = req.params;
        const { status } = req.body;

        const request = await DonationRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        );

        res.json({
            message: "Request updated",
            request
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createDonationRequest,
    getNGORequests,
    updateRequestStatus
};