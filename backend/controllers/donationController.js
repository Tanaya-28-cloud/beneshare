const DonationRequest = require("../models/DonationRequest");
const cloudinary = require("../config/cloudinary");


// CREATE DONATION REQUEST (Donor)
const createDonationRequest = async (req, res) => {
    try {
        console.log(req.body);
        const { donorId, ngoId, itemType, description } = req.body;

        if (!donorId || !ngoId || !itemType || !description) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        let imageUrl = "";

        // upload image if provided
        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    { folder: "donations" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                stream.end(req.file.buffer);

            });

            imageUrl = result.secure_url;
        }

        const request = new DonationRequest({
            donor: donorId,
            ngo: ngoId,
            itemType,
            description,
            image: imageUrl
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