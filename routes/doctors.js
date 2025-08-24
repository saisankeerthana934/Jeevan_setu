// const express = require('express');
// const Doctor = require('../models/Doctor');
// const User = require('../models/User');
// const BloodRequest = require('../models/BloodRequest');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// // @desc    Get doctor profile
// // @route   GET /api/doctors/profile
// // @access  Private (Doctor)
// router.get('/profile', protect, authorize('doctor'), async (req, res) => {
//   try {
//     const doctor = await Doctor.findOne({ userId: req.user.id })
//       .populate('userId', 'name email phone location isVerified')
//       .populate('patients.patient', 'name bloodType location');

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: 'Doctor profile not found' });
//     }

//     res.json({ success: true, data: { doctor } });
//   } catch (error) {
//     console.error('Get doctor profile error:', error);
//     res.status(500).json({ success: false, message: 'Server error fetching doctor profile' });
//   }
// });

// // @desc    Get doctor's patients
// // @route   GET /api/doctors/patients
// // @access  Private (Doctor)
// router.get('/patients', protect, authorize('doctor'), async (req, res) => {
//   try {
//     const doctor = await Doctor.findOne({ userId: req.user.id })
//       .populate('patients.patient', 'name bloodType');

//     if (!doctor) {
//       return res.status(404).json({ success: false, message: 'Doctor profile not found' });
//     }

//     res.json({
//       success: true,
//       data: { patients: doctor.patients }
//     });
//   } catch (error) {
//     console.error('Get patients error:', error);
//     res.status(500).json({ success: false, message: 'Server error fetching patients' });
//   }
// });

// // @desc    Get doctor's blood requests
// // @route   GET /api/doctors/blood-requests
// // @access  Private (Doctor)
// router.get('/blood-requests', protect, authorize('doctor'), async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     const query = {
//       $or: [
//         { createdBy: req.user.id },
//         { 'doctor.phone': user.phone }
//       ]
//     };

//     const bloodRequests = await BloodRequest.find(query).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: { bloodRequests }
//     });
//   } catch (error) {
//     console.error('Get blood requests error:', error);
//     res.status(500).json({ success: false, message: 'Server error fetching blood requests' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const Doctor = require('../models/Doctor');
// const User = require('../models/User');
// const BloodRequest = require('../models/BloodRequest');
// const { protect, authorize } = require('../middleware/auth');
// const { getCompatibleDonors } = require('../utils/bloodCompatibility');
const express = require('express');
const { body, validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Donor = require('../models/Donor'); // Import Donor model
const BloodRequest = require('../models/BloodRequest');
const { protect, authorize } = require('../middleware/auth');
const { getCompatibleDonors } = require('../utils/bloodCompatibility');
const TransfusionData = require('../models/TransfusionData');
const Notification = require('../models/Notification');
//const Donor = require('../models/Donor');

const router = express.Router();

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor)
router.get('/profile', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone location isVerified')
      .populate('patients.patient', 'name bloodType email location');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }
    res.json({ success: true, data: { doctor } });
  } catch (error) {
    next(error);
  }
});

// @desc    Get doctor's patients
// @route   GET /api/doctors/patients
// @access  Private (Doctor)
router.get('/patients', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id })
      .populate('patients.patient', 'name bloodType email');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.json({
      success: true,
      data: {
        patients: doctor.patients
      }
    });
  } catch (error) {
    next(error);
  }
});


// @desc    Add a patient to the doctor's list by email
// @route   POST /api/doctors/patients
// @access  Private (Doctor)
router.post('/patients', protect, authorize('doctor'), [
    body('email').isEmail().withMessage('Please provide a valid patient email')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { email } = req.body;

        const patientUser = await User.findOne({ email, role: 'patient' });
        if (!patientUser) {
            return res.status(404).json({ success: false, message: 'No patient found with this email.' });
        }

        const doctor = await Doctor.findOne({ userId: req.user.id });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
        }

        const isAlreadyPatient = doctor.patients.some(p => p.patient.toString() === patientUser._id.toString());
        if (isAlreadyPatient) {
            return res.status(400).json({ success: false, message: 'This patient is already on your list.' });
        }

        doctor.patients.push({ patient: patientUser._id });
        await doctor.save();
        
        await doctor.populate('patients.patient', 'name bloodType email');

        res.status(200).json({
            success: true,
            message: `${patientUser.name} has been successfully added to your patient list.`,
            data: {
                patients: doctor.patients
            }
        });

    } catch (error) {
        next(error);
    }
});

// @desc    Get doctor's blood requests
// @route   GET /api/doctors/blood-requests
// @access  Private (Doctor)
router.get('/blood-requests', protect, authorize('doctor'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const query = {
      $or: [
        { createdBy: req.user.id },
        { 'doctor.phone': user.phone }
      ]
    };

    const bloodRequests = await BloodRequest.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { bloodRequests }
    });
  } catch (error) {
    next(error);
  }
});


// --- 🔽 NEW ROUTE ADDED HERE 🔽 ---
// @desc    Remove a patient from the doctor's list
// @route   DELETE /api/doctors/patients/:patientId
// @access  Private (Doctor)
router.delete('/patients/:patientId', protect, authorize('doctor'), async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id });

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
        }

        // Check if the patient exists on the doctor's list
        const patientIndex = doctor.patients.findIndex(p => p.patient.toString() === req.params.patientId);
        
        if (patientIndex === -1) {
            return res.status(404).json({ success: false, message: 'Patient not found on your list.' });
        }

        // Remove the patient using Mongoose's .pull() method
        doctor.patients.pull({ patient: req.params.patientId });
        await doctor.save();
        
        res.status(200).json({
            success: true,
            message: 'Patient removed successfully.',
        });

    } catch (error) {
        next(error);
    }
    router.get('/blood-requests', protect, authorize('doctor'), async (req, res, next) => {
  try {
    // --- 🔽 THIS IS THE FIX 🔽 ---
    // The original query was complex. This is simpler and more reliable.
    // It finds all blood requests created by the currently logged-in user (who is a doctor).
    const bloodRequests = await BloodRequest.find({ createdBy: req.user.id })
        .populate('patient', 'name')
        .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { bloodRequests }
    });
  } catch (error) {
    next(error);
  }
});
});
// router.post('/find-donors', protect, authorize('doctor'), [
//     body('city').trim().notEmpty().withMessage('City is required.'),
//     body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('A valid blood type is required.')
// ], async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     try {
//         const { city, bloodType } = req.body;

//         // 1. Get all blood types that can donate to the requested type
//         const compatibleBloodTypes = getCompatibleDonors(bloodType);

//         // 2. Find all User documents that match the city
//         const usersInCity = await User.find({ 'location.city': new RegExp(`^${city}$`, 'i') }, '_id');
//         const userIds = usersInCity.map(user => user._id);

//         // 3. Find all available and eligible donors who are in that city AND have a compatible blood type
//         const compatibleDonors = await Donor.find({
//             userId: { $in: userIds },
//             bloodType: { $in: compatibleBloodTypes },
//             'availability.isAvailable': true,
//             isEligible: true
//         }).populate('userId', 'name phone location'); // Populate with user details

//         res.json({
//             success: true,
//             data: {
//                 donors: compatibleDonors
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// });
router.post('/find-donors', protect, authorize('doctor'), [
    body('city').trim().notEmpty().withMessage('City is required.'),
    body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('A valid blood type is required.')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { city, bloodType } = req.body;
        const compatibleBloodTypes = getCompatibleDonors(bloodType);

        // --- MODIFICATION START ---

        // Step 1: Query for LIVE registered donors (your original query)
        const findLiveDonors = async () => {
            const usersInCity = await User.find({ 'location.city': new RegExp(`^${city}$`, 'i') }, '_id');
            const userIds = usersInCity.map(user => user._id);
            return Donor.find({
                userId: { $in: userIds },
                bloodType: { $in: compatibleBloodTypes },
                'availability.isAvailable': true,
                isEligible: true
            }).populate('userId', 'name phone location');
        };

        // Step 2: Query the IMPORTED dataset
        const findImportedDonors = () => {
            return TransfusionData.find({
                donorLocation: new RegExp(city, 'i'),
                donorBloodGroup: { $in: compatibleBloodTypes }
            });
        };

        // Step 3: Run both searches in parallel and combine results
        const [liveDonors, importedDonors] = await Promise.all([
            findLiveDonors(),
            findImportedDonors()
        ]);

        // Format the imported data to be consistent with live data for the frontend
        const formattedImportedDonors = importedDonors.map(d => ({
            userId: { // Create a structure similar to the populated User
                name: `Donor #${d.donorId}`, // Placeholder name
                phone: d.donorPhoneNumber,
                location: { city: d.donorLocation }
            },
            bloodType: d.donorBloodGroup,
            isDataSet: true // Add a flag to identify these donors
        }));
        
        const allDonors = [...liveDonors, ...formattedImportedDonors];

        // --- MODIFICATION END ---

        res.json({
            success: true,
            data: {
                donors: allDonors
            }
        });
    } catch (error) {
        next(error);
    }
    
});

// --- 🔼 END OF NEW ROUTE 🔼 ---


module.exports = router;