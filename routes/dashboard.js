// const express = require('express');
// const DonorRecord = require('../models/DonorRecord');
// const router = express.Router();

// // --- API 1: Predictive Shortage Analysis ---
// // @desc    Forecast blood supply for the next 14 days
// // @route   GET /api/dashboard/shortage-forecast
// router.get('/shortage-forecast', async (req, res) => {
//     try {
//         const fourteenDaysFromNow = new Date();
//         fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

//         // Aggregate data to count eligible donors by blood group
//         const supplyForecast = await DonorRecord.aggregate([
//             {
//                 $match: {
//                     nextEligibleDate: { $lte: fourteenDaysFromNow }, // Eligible within 2 weeks
//                     eligibilityStatus: 'eligible'
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$bloodGroup', // Group by blood type
//                     count: { $sum: 1 }   // Count donors in each group
//                 }
//             },
//             { $sort: { _id: 1 } } // Sort by blood group name
//         ]);

//         res.json({ success: true, data: supplyForecast });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// });

// // --- API 2: Smart Bridge Donor Finder ---
// // @desc    Find the best "Bridge Donors" to call for a specific need
// // @route   GET /api/dashboard/find-bridge-donors
// router.get('/find-bridge-donors', async (req, res) => {
//     const { bloodGroup } = req.query;
//     if (!bloodGroup) {
//         return res.status(400).json({ message: 'Blood group is required.' });
//     }

//     try {
//         const potentialDonors = await DonorRecord.find({
//             bloodGroup: bloodGroup,
//             role: 'Bridge Donor', // Specifically target Bridge Donors
//             eligibilityStatus: 'eligible'
//         })
//         .sort({ callsToDonationsRatio: -1, totalCalls: 1 }) // Sort by best ratio, then fewest calls
//         .limit(5); // Find the top 5

//         res.json({ success: true, data: potentialDonors });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// });

// // --- API 3: Geospatial Heatmap Data ---
// // @desc    Get data for the supply/demand heatmap
// // @route   GET /api/dashboard/heatmap
// router.get('/heatmap', async (req, res) => {
//     try {
//         // For a hackathon, we can just return all eligible donor locations
//         const donorLocations = await DonorRecord.find(
//             { eligibilityStatus: 'eligible' },
//             { location: 1, bloodGroup: 1, _id: 0 } // Select only location and blood group
//         );
//         res.json({ success: true, data: donorLocations });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// });


// module.exports = router;
const express = require('express');
const DonorRecord = require('../models/DonorRecord');
const router = express.Router();

// --- API 1: Predictive Shortage Analysis ---
router.get('/shortage-forecast', async (req, res) => {
    try {
        const fourteenDaysFromNow = new Date();
        fourteenDaysFromNow.setDate(fourteenDaysFromNow.getDate() + 14);

        const supplyForecast = await DonorRecord.aggregate([
            {
                $match: {
                    nextEligibleDate: { $lte: fourteenDaysFromNow },
                    eligibilityStatus: 'eligible'
                }
            },
            {
                $group: {
                    _id: '$bloodGroup',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({ success: true, data: supplyForecast });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// --- API 2: Smart Bridge Donor Finder ---
router.get('/find-bridge-donors', async (req, res) => {
    const { bloodGroup } = req.query;
    if (!bloodGroup) {
        return res.status(400).json({ message: 'Blood group is required.' });
    }

    try {
        const potentialDonors = await DonorRecord.find({
            bloodGroup: bloodGroup,
            role: 'Bridge Donor',
            eligibilityStatus: 'eligible'
        })
        .sort({ callsToDonationsRatio: -1, totalCalls: 1 })
        .limit(5);

        res.json({ success: true, data: potentialDonors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// --- API 3: Geospatial Heatmap Data ---
router.get('/heatmap', async (req, res) => {
    try {
        const donorLocations = await DonorRecord.find(
            { eligibilityStatus: 'eligible' },
            { location: 1, bloodGroup: 1, _id: 0 }
        );
        res.json({ success: true, data: donorLocations });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
