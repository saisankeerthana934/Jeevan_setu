// const express = require('express');
// const router = express.Router();
// const { body, validationResult } = require('express-validator');
// const sendEmail = require('../utils/sendEmail');

// const User = require('../models/User');
// const Donor = require('../models/Donor');
// const BloodRequest = require('../models/BloodRequest');

// // @desc    Get public statistics for the homepage
// // @route   GET /api/public/stats
// // @access  Public
// router.get('/stats', async (req, res, next) => {
//     try {
//         // 1. Count registered donors
//         const registeredDonors = await Donor.countDocuments();

//         // 2. Count total blood units collected (lives saved)
//         const livesSavedResult = await Donor.aggregate([
//             { $unwind: '$donationHistory' },
//             { $group: { _id: null, totalUnits: { $sum: '$donationHistory.units' } } }
//         ]);
//         const livesSaved = livesSavedResult.length > 0 ? livesSavedResult[0].totalUnits : 0;

//         // 3. Count unique cities covered
//         const cities = await User.distinct('location.city');
//         const citiesCovered = cities.length;

//         // 4. Calculate success rate of blood requests
//         const totalRequests = await BloodRequest.countDocuments();
//         const fulfilledRequests = await BloodRequest.countDocuments({ status: 'fulfilled' });
//         const successRate = totalRequests > 0 ? Math.round((fulfilledRequests / totalRequests) * 100) : 0;

//         res.json({
//             success: true,
//             data: {
//                 registeredDonors,
//                 livesSaved,
//                 citiesCovered,
//                 successRate
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// });
// router.post('/contact', [
//     body('name').trim().notEmpty().withMessage('Name is required.'),
//     body('email').isEmail().withMessage('Please provide a valid email.'),
//     body('message').trim().notEmpty().withMessage('Message cannot be empty.'),
// ], async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     const { name, email, message } = req.body;

//     try {
//         await sendEmail({
//             name,
//             email,
//             subject: `New Contact Message from ${name} - JeevanSetu`,
//             message,
//         });

//         res.status(200).json({ success: true, message: 'Message sent successfully!' });
//     } catch (error) {
//         console.error('Contact form email error:', error);
//         next(new Error('Email could not be sent. Please try again later.'));
//     }
// });
// module.exports = router;

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

// Your existing models
const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');

// --- 🔽 ADD THIS LINE TO IMPORT THE NEW MODEL 🔽 ---
const TransfusionData = require('../models/TransfusionData');

// @desc    Get public statistics for the homepage
// @route   GET /api/public/stats
// @access  Public
router.get('/stats', async (req, res, next) => {
    try {
        const registeredDonors = await Donor.countDocuments();
        const livesSavedResult = await Donor.aggregate([
            { $unwind: '$donationHistory' },
            { $group: { _id: null, totalUnits: { $sum: '$donationHistory.units' } } }
        ]);
        const livesSaved = livesSavedResult.length > 0 ? livesSavedResult[0].totalUnits : 0;
        const cities = await User.distinct('location.city');
        const citiesCovered = cities.length;
        const totalRequests = await BloodRequest.countDocuments();
        const fulfilledRequests = await BloodRequest.countDocuments({ status: 'fulfilled' });
        const successRate = totalRequests > 0 ? Math.round((fulfilledRequests / totalRequests) * 100) : 0;

        res.json({
            success: true,
            data: { registeredDonors, livesSaved, citiesCovered, successRate }
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Handle contact form submissions
// @route   POST /api/public/contact
// @access  Public
router.post('/contact', [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Please provide a valid email.'),
    body('message').trim().notEmpty().withMessage('Message cannot be empty.'),
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { name, email, message } = req.body;
    try {
        await sendEmail({
            name,
            email,
            subject: `New Contact Message from ${name} - JeevanSetu`,
            message,
        });
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Contact form email error:', error);
        next(new Error('Email could not be sent. Please try again later.'));
    }
});

// --- 🔽 ADD THIS NEW ROUTE FOR THE HACKATHON FEATURE 🔽 ---
// @desc    Search for blood donors by location and blood group
// @route   GET /api/public/find-donors
// @access  Public
router.get('/find-donors', async (req, res) => {
  try {
    const { location, bloodGroup } = req.query; 

    if (!location || !bloodGroup) {
      return res.status(400).json({ success: false, message: 'Location and bloodGroup query parameters are required' });
    }

    const compatibility = {
      'A+': ['A+', 'A-', 'O+', 'O-'], 'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'], 'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'], 'O-': ['O-'],
    };

    const compatibleGroups = compatibility[bloodGroup];
    if (!compatibleGroups) {
        return res.status(400).json({ success: false, message: 'Invalid blood group provided.' });
    }

    const query = {
      donorLocation: new RegExp(location, 'i'),
      donorBloodGroup: { $in: compatibleGroups }
    };

    const donors = await TransfusionData.find(query).limit(20);
    res.json({ success: true, data: donors });

  } catch (error) {
    console.error("Donor search error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});
// --- 🔼 END OF NEW ROUTE 🔼 ---

module.exports = router;