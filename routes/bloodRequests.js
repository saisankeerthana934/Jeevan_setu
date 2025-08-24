// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const BloodRequest = require('../models/BloodRequest');
// const Donor = require('../models/Donor');
// const User = require('../models/User');
// const Notification = require('../models/Notification');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// /**
//  * @desc    Create blood request
//  * @route   POST /api/blood-requests
//  * @access  Private (Patient, Doctor)
//  */
// router.post(
//   '/',
//   protect,
//   authorize('patient', 'doctor'),
//   [
//     body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
//     body('unitsRequired').isInt({ min: 1, max: 10 }),
//     body('urgency').isIn(['critical', 'high', 'moderate', 'routine']),
//     body('hospital.name').trim().notEmpty(),
//     body('hospital.city').trim().notEmpty(),
//     body('requiredBy').isISO8601(),
//     body('doctor.name').trim().notEmpty(),
//     body('doctor.phone').isMobilePhone(),
//   ],
//   async (req, res) => {
//     try {
//       // Validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res
//           .status(400)
//           .json({ success: false, message: 'Validation errors', errors: errors.array() });
//       }

//       const {
//         bloodType,
//         unitsRequired,
//         urgency,
//         hospital,
//         requiredBy,
//         doctor,
//         patientCondition,
//         additionalNotes,
//       } = req.body;

//       // Patient ID logic
//       let patientId = req.user.role === 'patient' ? req.user.id : req.body.patientId;
//       if (!patientId) {
//         return res.status(400).json({
//           success: false,
//           message: 'Patient ID is required when creating a request as a doctor.',
//         });
//       }

//       // Create request
//       const bloodRequest = await BloodRequest.create({
//         patient: patientId,
//         bloodType,
//         unitsRequired,
//         urgency,
//         hospital,
//         requiredBy: new Date(requiredBy),
//         doctor,
//         patientCondition,
//         additionalNotes,
//         createdBy: req.user.id,
//       });

//       // Donor matching
//       const donors = await Donor.find({
//         bloodType: bloodType,
//         'availability.isAvailable': true,
//         isEligible: true,
//       }).populate('userId', 'location');

//       const nearbyDonors = donors.filter(
//         (donor) =>
//           donor.userId &&
//           donor.userId.location &&
//           donor.userId.location.city.toLowerCase() === hospital.city.toLowerCase()
//       );

//       // Save matched donors
//       bloodRequest.matchedDonors = nearbyDonors.slice(0, 10).map((donor) => ({ donor: donor._id }));
//       await bloodRequest.save();

//       // Send notifications
//       for (const donor of nearbyDonors.slice(0, 5)) {
//         await Notification.create({
//           recipient: donor.userId._id,
//           type: 'blood_request',
//           title: `Urgent: ${bloodType} Blood Needed`,
//           message: `A request for ${unitsRequired} units of ${bloodType} is needed at ${hospital.name}, ${hospital.city}.`,
//           data: { bloodRequestId: bloodRequest._id },
//         });
//       }

//       res.status(201).json({
//         success: true,
//         message: 'Blood request created successfully and donors have been notified.',
//         data: bloodRequest,
//       });
//     } catch (error) {
//       console.error('Create blood request error:', error);

//       res.status(500).json({
//         success: false,
//         message: error.message || 'Server error creating blood request',
//         errors: error.errors || null,
//       });
//     }
//   }
// );

// /**
//  * @desc    Get blood requests
//  * @route   GET /api/blood-requests
//  * @access  Private
//  */
// router.get('/', protect, async (req, res) => {
//   try {
//     let query = {};
//     const user = await User.findById(req.user.id);

//     if (req.user.role === 'patient') {
//       query.patient = req.user.id;
//     } else if (req.user.role === 'doctor') {
//       query.$or = [{ createdBy: req.user.id }, { 'doctor.phone': user.phone }];
//     } else if (req.user.role === 'donor') {
//       const donorProfile = await Donor.findOne({ userId: req.user.id });
//       if (donorProfile) {
//         query.status = 'active';
//         query['hospital.city'] = user.location.city;
//         query.bloodType = donorProfile.bloodType;
//       }
//     }

//     const bloodRequests = await BloodRequest.find(query)
//       .populate('patient', 'name')
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: bloodRequests });
//   } catch (error) {
//     console.error('Get blood requests error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Server error fetching blood requests' });
//   }
// });

// /**
//  * @desc    Respond to blood request (donor)
//  * @route   POST /api/blood-requests/:id/respond
//  * @access  Private (Donor)
//  */
// router.post('/:id/respond', protect, authorize('donor'), [body('response').isIn(['accepted', 'declined'])], async (req, res) => {
//   try {
//     const { response } = req.body;
//     const bloodRequest = await BloodRequest.findById(req.params.id);
//     if (!bloodRequest) {
//       return res.status(404).json({ success: false, message: 'Blood request not found' });
//     }

//     const donor = await Donor.findOne({ userId: req.user.id });
//     const matchIndex = bloodRequest.matchedDonors.findIndex(
//       (match) => match.donor.toString() === donor._id.toString()
//     );

//     if (matchIndex === -1) {
//       return res.status(400).json({ success: false, message: 'You are not matched for this request' });
//     }

//     bloodRequest.matchedDonors[matchIndex].response = response;
//     await bloodRequest.save();

//     await Notification.create({
//       recipient: bloodRequest.patient,
//       type: 'donor_match',
//       title: `Donor Response: ${response}`,
//       message: `A donor has ${response} your request for ${bloodRequest.bloodType} blood.`,
//       data: { bloodRequestId: bloodRequest._id },
//     });

//     res.json({ success: true, message: 'Response recorded successfully' });
//   } catch (error) {
//     console.error('Respond to blood request error:', error);
//     res.status(500).json({ success: false, message: error.message || 'Server error responding to blood request' });
//   }
// });

// module.exports = router;
const express = require('express');
const { body, validationResult } = require('express-validator');
const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');
// CORRECTED: Import the blood compatibility utility
const { getCompatibleDonors } = require('../utils/bloodCompatibility');
const { generateEmpatheticDonorMessage } = require('../services/aiService');

const router = express.Router();

// @desc    Create blood request
// @route   POST /api/blood-requests
// @access  Private (Patient, Doctor)
// router.post('/', protect, authorize('patient', 'doctor'), [
//     body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
//     body('unitsRequired').isInt({ min: 1, max: 10 }),
//     body('urgency').isIn(['critical', 'high', 'moderate', 'routine']),
//     body('hospital.name').trim().notEmpty(),
//     body('hospital.city').trim().notEmpty(),
//     body('requiredBy').isISO8601(),
//     body('doctor.name').trim().notEmpty(),
//     body('doctor.phone').isMobilePhone()
// ], async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
//         }

//         const { bloodType, unitsRequired, urgency, hospital, requiredBy, doctor, patientCondition, additionalNotes } = req.body;

//         let patientId = req.user.role === 'patient' ? req.user.id : req.body.patientId;
//         if (!patientId) {
//             return res.status(400).json({ success: false, message: 'Patient ID is required when creating a request as a doctor.' });
//         }

//         const bloodRequest = await BloodRequest.create({
//             patient: patientId,
//             bloodType,
//             unitsRequired,
//             urgency,
//             hospital,
//             requiredBy: new Date(requiredBy),
//             doctor,
//             patientCondition,
//             additionalNotes,
//             createdBy: req.user.id
//         });

//         // --- CORRECTED DONOR MATCHING LOGIC ---
//         // 1. Get all compatible blood types for the request
//         const compatibleBloodTypes = getCompatibleDonors(bloodType);

//         // 2. Find all available and eligible donors with a compatible blood type
//         const donors = await Donor.find({
//             bloodType: { $in: compatibleBloodTypes }, // Use the compatibility list
//             'availability.isAvailable': true,
//             isEligible: true
//         }).populate('userId', 'location');
//         // --- END OF CORRECTIONS ---

//         const nearbyDonors = donors.filter(donor => donor.userId && donor.userId.location && donor.userId.location.city.toLowerCase() === hospital.city.toLowerCase());

//         bloodRequest.matchedDonors = nearbyDonors.slice(0, 10).map(donor => ({ donor: donor._id }));
//         await bloodRequest.save();

//         // Send notifications to the first 5 matched donors
//         for (const donor of nearbyDonors.slice(0, 5)) {
//             await Notification.createAndSend({
//                 recipient: donor.userId._id,
//                 type: 'blood_request',
//                 title: `Urgent: ${bloodType} Blood Needed`,
//                 message: `A request for ${unitsRequired} units of ${bloodType} is needed at ${hospital.name}, ${hospital.city}.`,
//                 data: { bloodRequestId: bloodRequest._id }
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: 'Blood request created successfully and donors have been notified.',
//             data: { bloodRequest }
//         });

//     } catch (error) {
//         console.error('Create blood request error:', error);
//         next(error);
//     }
// });
// router.post('/', protect, authorize('patient', 'doctor'), [
//     body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
//     body('unitsRequired').isInt({ min: 1, max: 10 }),
//     body('urgency').isIn(['critical', 'high', 'moderate', 'routine']),
//     body('hospital.name').trim().notEmpty(),
//     body('hospital.city').trim().notEmpty(),
//     body('requiredBy').isISO8601(),
// ], async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
//         }

//         const { bloodType, unitsRequired, urgency, hospital, requiredBy, doctor, patientCondition } = req.body;

//         // --- 🔽 THIS LOGIC HANDLES BOTH ROLES 🔽 ---
//         let patientId;
//         if (req.user.role === 'patient') {
//             patientId = req.user.id;
//         } else { // Role is 'doctor'
//             patientId = req.body.patientId;
//             if (!patientId) {
//                 return res.status(400).json({ success: false, message: 'Patient ID is required when creating a request as a doctor.' });
//             }
//         }
        
//         const bloodRequest = await BloodRequest.create({
//             patient: patientId,
//             bloodType,
//             unitsRequired,
//             urgency,
//             hospital,
//             requiredBy: new Date(requiredBy),
//             doctor,

//             patientCondition,
//             createdBy: req.user.id,
//             status: 'active' // Set status to active immediately
//         });

//         // --- Donor matching and notification logic ---
//         const compatibleBloodTypes = getCompatibleDonors(bloodType);
//         const donors = await Donor.find({
//             bloodType: { $in: compatibleBloodTypes },
//             'availability.isAvailable': true,
//             isEligible: true
//         }).populate('userId', 'location');

//         const nearbyDonors = donors.filter(d => d.userId?.location?.city.toLowerCase() === hospital.city.toLowerCase());
        
//         bloodRequest.matchedDonors = nearbyDonors.slice(0, 10).map(d => ({ donor: d._id }));
//         await bloodRequest.save();

//         for (const donor of nearbyDonors.slice(0, 5)) {
//             await Notification.create({
//                 recipient: donor.userId._id,
//                 type: 'blood_request',
//                 title: `Urgent: ${bloodType} Blood Needed`,
//                 message: `A request for ${unitsRequired} units is needed at ${hospital.name}.`,
//                 data: { bloodRequestId: bloodRequest._id }
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: 'Blood request created successfully and donors have been notified.',
//             data: { bloodRequest }
//         });

//     } catch (error) {
//         next(error);
//     }
// });
router.post('/', protect, authorize('patient', 'doctor'), [/* ... validations */], async (req, res, next) => {
  try {
    // ... your existing code to get patientId

    // --- 🔽 ADD THIS VERIFICATION BLOCK 🔽 ---
    const patientUser = await User.findById(patientId);
    if (!patientUser) {
      return res.status(404).json({ success: false, message: 'Patient record not found.' });
    }

    // Check if the requested blood type matches the patient's registered blood type
    if (req.body.bloodType !== patientUser.bloodType) {
      return res.status(400).json({
        success: false,
        message: `You can only request your registered blood type (${patientUser.bloodType}).`
      });
    }
    // --- 🔼 END OF VERIFICATION BLOCK 🔼 ---
    
    // ... rest of your code to create the blood request
    
  } catch (error) {
    next(error);
  }
});

// @desc    Get blood requests (This route is now more effective)
// @route   GET /api/blood-requests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    const user = await User.findById(req.user.id);

    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      query.$or = [{ createdBy: req.user.id }, { 'doctor.phone': user.phone }];
    } else if (req.user.role === 'donor') {
      const donorProfile = await Donor.findOne({ userId: req.user.id });
      if (donorProfile) {
        // CORRECTED: This now correctly finds all active requests the donor has been matched with.
        const matchedRequests = await BloodRequest.find({ 
            'matchedDonors.donor': donorProfile._id,
            status: 'active' 
        });
        const requestIds = matchedRequests.map(req => req._id);
        query._id = { $in: requestIds };
      }
    }

    const bloodRequests = await BloodRequest.find(query).populate('patient', 'name').sort({ createdAt: -1 });
    res.json({ success: true, data: { bloodRequests } });

  } catch (error) {
    console.error('Get blood requests error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching blood requests' });
  }
});


// @desc    Respond to blood request (donor)
// @route   POST /api/blood-requests/:id/respond
// @access  Private (Donor)
router.post('/:id/respond', protect, authorize('donor'), [
    body('response').isIn(['accepted', 'declined']),
], async (req, res) => {
  try {
    const { response } = req.body;
    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    const donor = await Donor.findOne({ userId: req.user.id }).populate('userId', 'name');

    // --- THIS IS THE ENHANCEMENT ---
    if (response === 'accepted') {
        // 1. Check if the donor is already committed to another request
        if (!donor.availability.isAvailable) {
            return res.status(400).json({ success: false, message: 'You have already accepted another request. Please complete or cancel it first.' });
        }

        // 2. Update the blood request
        bloodRequest.status = 'fulfilled';
        bloodRequest.fulfilledBy = donor._id;
        await bloodRequest.save();

        // 3. Update the donor's status to make them unavailable
        donor.availability.isAvailable = false;
        await donor.save();

        // 4. Notify the patient
        await Notification.create({
            recipient: bloodRequest.patient,
            type: 'donor_match',
            title: `Donor Found for your ${bloodRequest.bloodType} request!`,
            message: `${donor.userId.name} has accepted your request. They will be in contact shortly.`,
            data: { bloodRequestId: bloodRequest._id }
        });
    }
    // --- END OF ENHANCEMENT ---

    res.json({ success: true, message: `Response recorded successfully` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error responding to blood request' });
  }
});
router.post('/:id/initiate-outreach', protect, authorize('patient', 'doctor'), async (req, res, next) => {
    try {
        const bloodRequest = await BloodRequest.findById(req.params.id).populate('patient', 'name');
        if (!bloodRequest) {
            return res.status(404).json({ success: false, message: 'Blood request not found.' });
        }

        // --- THIS IS THE UPGRADED LOGIC ---
        // 1. Find users in the correct city
        const usersInCity = await User.find({ 
            'location.city': new RegExp(`^${bloodRequest.hospital.city}$`, 'i') 
        }, '_id');
        
        const userIdsInCity = usersInCity.map(user => user._id);

        // 2. Find eligible donors linked to those users
        const compatibleBloodTypes = getCompatibleDonors(bloodRequest.bloodType);
        const eligibleDonors = await Donor.find({
            userId: { $in: userIdsInCity }, // Search for donors from users in the city
            bloodType: { $in: compatibleBloodTypes },
            'availability.isAvailable': true,
        }).populate('userId', 'name _id').limit(5); // Populate userId to get name and ID
        // --- END OF UPGRADE ---

        if (eligibleDonors.length === 0) {
            return res.status(404).json({ success: false, message: 'No eligible donors found in this area right now.' });
        }

        for (const donor of eligibleDonors) {
            const aiMessage = await generateEmpatheticDonorMessage({
                donorName: donor.userId.name,
                patientName: bloodRequest.patient.name,
                bloodType: bloodRequest.bloodType,
                city: bloodRequest.hospital.city
            });

            await Notification.create({
                recipient: donor.userId._id, // Use the populated userId
                sender: req.user.id,
                type: 'blood_request',
                priority: 'high',
                title: `Urgent Request: ${bloodRequest.bloodType} Needed`,
                message: aiMessage,
                data: { bloodRequestId: bloodRequest._id }
            });
        }

        res.status(200).json({ success: true, message: `AI-powered outreach initiated to ${eligibleDonors.length} donors.` });

    } catch (error) {
        next(error);
    }
});
router.put('/:id/activate', protect, authorize('patient'), async (req, res, next) => {
    try {
        // 1. Enforce the "one active request" rule
        const existingActiveRequest = await BloodRequest.findOne({
    patient: req.user.id,
    status: 'active'
});

if (existingActiveRequest) {
    return res.status(400).json({
        success: false,
        message: 'You already have another active blood request.'
    });
}

        // 2. Find the request and verify the patient owns it
        const bloodRequest = await BloodRequest.findById(req.params.id);
        if (!bloodRequest || bloodRequest.patient.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Blood request not found.' });
        }

        if (bloodRequest.status !== 'pending_activation') {
            return res.status(400).json({ success: false, message: 'This request cannot be activated.' });
        }
        
        // 3. Activate the request and find donors
        bloodRequest.status = 'active';
        
        const compatibleBloodTypes = getCompatibleDonors(bloodRequest.bloodType);
        const donors = await Donor.find({
            bloodType: { $in: compatibleBloodTypes },
            'availability.isAvailable': true,
            isEligible: true
        }).populate('userId', 'location');

        const nearbyDonors = donors.filter(d => d.userId?.location?.city.toLowerCase() === bloodRequest.hospital.city.toLowerCase());
        
        bloodRequest.matchedDonors = nearbyDonors.slice(0, 10).map(d => ({ donor: d._id }));
        await bloodRequest.save();

        // 4. Notify donors
        for (const donor of nearbyDonors.slice(0, 5)) {
            await Notification.create({
                recipient: donor.userId._id,
                type: 'blood_request',
                title: `Urgent: ${bloodRequest.bloodType} Blood Needed`,
                message: `A request for ${bloodRequest.unitsRequired} units is needed at ${bloodRequest.hospital.name}.`,
                data: { bloodRequestId: bloodRequest._id }
            });
        }

        res.json({
            success: true,
            message: 'Request activated! Nearby donors have been notified.',
            data: { bloodRequest }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
