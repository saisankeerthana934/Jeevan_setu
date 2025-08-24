const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Donor = require('../models/Donor');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all donors
// @route   GET /api/donors
// @access  Private (Doctor, NGO)
router.get('/', protect, authorize('doctor', 'ngo'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  query('city').optional().isString(),
  query('available').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (req.query.bloodType) query.bloodType = req.query.bloodType;
    if (req.query.available === 'true') query['availability.isAvailable'] = true;
    if (req.query.eligible === 'true') query.isEligible = true;

    // Location filter
    let userQuery = {};
    if (req.query.city) {
      userQuery['location.city'] = new RegExp(req.query.city, 'i');
    }

    const donors = await Donor.find(query)
      .populate({
        path: 'userId',
        match: userQuery,
        select: 'name phone location isVerified'
      })
      .sort({ 'statistics.totalDonations': -1 })
      .skip(skip)
      .limit(limit);

    // Filter out donors where userId is null (due to location filter)
    const filteredDonors = donors.filter(donor => donor.userId);

    const total = await Donor.countDocuments(query);

    res.json({
      success: true,
      data: {
        donors: filteredDonors,
        pagination: {
          page,
          limit,
          total: filteredDonors.length,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get donors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donors',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get donor profile
// @route   GET /api/donors/profile
// @access  Private (Donor)
router.get('/profile', protect, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone location profile isVerified');

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    // Get recent blood requests this donor was matched for
    const recentRequests = await BloodRequest.find({
      'matchedDonors.donor': donor._id
    })
    .populate('patient', 'name location')
    .sort({ createdAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        donor,
        recentRequests
      }
    });

  } catch (error) {
    console.error('Get donor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donor profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update donor profile
// @route   PUT /api/donors/profile
// @access  Private (Donor)
router.put('/profile', protect, authorize('donor'), [
  body('age').optional().isInt({ min: 18, max: 65 }),
  body('weight').optional().isInt({ min: 50 }),
  body('availability.isAvailable').optional().isBoolean(),
  body('availability.maxDistance').optional().isInt({ min: 1, max: 200 }),
  body('availability.preferredTime').optional().isIn(['morning', 'afternoon', 'evening', 'anytime'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'age', 'weight', 'availability', 'medicalInfo'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'availability' || field === 'medicalInfo') {
          donor[field] = { ...donor[field].toObject(), ...req.body[field] };
        } else {
          donor[field] = req.body[field];
        }
      }
    });

    // Recalculate eligibility
    donor.isEligible = donor.calculateEligibility();

    await donor.save();

    res.json({
      success: true,
      message: 'Donor profile updated successfully',
      data: { donor }
    });

  } catch (error) {
    console.error('Update donor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating donor profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update availability status
// @route   PUT /api/donors/availability
// @access  Private (Donor)
router.put('/availability', protect, authorize('donor'), [
  body('isAvailable').isBoolean().withMessage('Availability status is required'),
  body('availableFrom').optional().isISO8601().withMessage('Valid available from date required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { isAvailable, availableFrom, reason } = req.body;

    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    donor.availability.isAvailable = isAvailable;
    if (availableFrom) {
      donor.availability.availableFrom = new Date(availableFrom);
    }

    await donor.save();

    res.json({
      success: true,
      message: `Availability status updated to ${isAvailable ? 'available' : 'unavailable'}`,
      data: {
        availability: donor.availability
      }
    });

  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Record donation
// @route   POST /api/donors/donation
// @access  Private (Donor, Doctor)
router.post('/donation', protect, authorize('donor', 'doctor'), [
  body('donorId').optional().isMongoId().withMessage('Valid donor ID required'),
  body('units').isInt({ min: 1, max: 4 }).withMessage('Units must be between 1 and 4'),
  body('hospital').trim().notEmpty().withMessage('Hospital name is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('donationDate').isISO8601().withMessage('Valid donation date required'),
  body('recipientId').optional().isMongoId().withMessage('Valid recipient ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { donorId, units, hospital, city, donationDate, recipientId } = req.body;

    // Determine which donor to update
    let donor;
    if (req.user.role === 'donor') {
      donor = await Donor.findOne({ userId: req.user.id });
    } else if (donorId) {
      donor = await Donor.findById(donorId);
    }

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // Check if donor is eligible
    if (!donor.calculateEligibility()) {
      return res.status(400).json({
        success: false,
        message: 'Donor is not eligible for donation yet'
      });
    }

    // Add to donation history
    const donationRecord = {
      date: new Date(donationDate),
      location: { hospital, city },
      units,
      bloodType: donor.bloodType,
      recipient: recipientId
    };

    donor.donationHistory.push(donationRecord);
    donor.lastDonation = new Date(donationDate);
    donor.updateStatistics();

    await donor.save();

    res.status(201).json({
      success: true,
      message: 'Donation recorded successfully',
      data: {
        donation: donationRecord,
        donor: {
          id: donor._id,
          totalDonations: donor.statistics.totalDonations,
          nextEligibleDate: donor.nextEligibleDate
        }
      }
    });

  } catch (error) {
    console.error('Record donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error recording donation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get donation history
// @route   GET /api/donors/donations
// @access  Private (Donor)
router.get('/donations', protect, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id })
      .populate('donationHistory.recipient', 'name');

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    const donations = donor.donationHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      data: {
        donations,
        statistics: donor.statistics,
        nextEligibleDate: donor.nextEligibleDate,
        isEligible: donor.calculateEligibility()
      }
    });

  } catch (error) {
    console.error('Get donation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donation history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get donor statistics
// @route   GET /api/donors/stats
// @access  Private (Donor)
router.get('/stats', protect, authorize('donor'), async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    // Calculate additional statistics
    const currentYear = new Date().getFullYear();
    const thisYearDonations = donor.donationHistory.filter(
      donation => new Date(donation.date).getFullYear() === currentYear
    ).length;

    const lastDonationDays = donor.lastDonation 
      ? Math.floor((new Date() - donor.lastDonation) / (1000 * 60 * 60 * 24))
      : null;

    // Get recent blood requests
    const recentRequests = await BloodRequest.find({
      'matchedDonors.donor': donor._id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('bloodType urgency status hospital createdAt');

    res.json({
      success: true,
      data: {
        statistics: donor.statistics,
        thisYearDonations,
        lastDonationDays,
        nextEligibleDate: donor.nextEligibleDate,
        isEligible: donor.calculateEligibility(),
        recentRequests,
        achievements: calculateAchievements(donor)
      }
    });

  } catch (error) {
    console.error('Get donor stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching donor statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to calculate achievements
function calculateAchievements(donor) {
  const achievements = [];
  const totalDonations = donor.statistics.totalDonations;

  if (totalDonations >= 1) achievements.push({ name: 'First Donation', icon: '🩸' });
  if (totalDonations >= 5) achievements.push({ name: 'Regular Donor', icon: '⭐' });
  if (totalDonations >= 10) achievements.push({ name: 'Super Donor', icon: '🏆' });
  if (totalDonations >= 25) achievements.push({ name: 'Hero Donor', icon: '🦸' });
  if (totalDonations >= 50) achievements.push({ name: 'Legend Donor', icon: '👑' });

  if (donor.statistics.averageResponseTime <= 2) {
    achievements.push({ name: 'Quick Responder', icon: '⚡' });
  }

  return achievements;
}

module.exports = router;