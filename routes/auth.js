

// const express = require('express');
// const crypto = require('crypto');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const Donor = require('../models/Donor');
// const Doctor = require('../models/Doctor');
// const NGO = require('../models/NGO');
// const { protect } = require('../middleware/auth');
// const sendEmail = require('../utils/sendEmail');

// const router = express.Router();

// // Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d'
//   });
// };

// // @desc    Register a new user
// // @route   POST /api/auth/register
// // @access  Public
// router.post('/register', [
//     body('name').trim().isLength({ min: 2 }),
//     body('email').isEmail().normalizeEmail(),
//     body('password').isLength({ min: 6 }),
//     body('phone').matches(/^[6-9]\d{9}$/),
//     body('role').isIn(['patient', 'donor', 'doctor', 'ngo']),
//     body('location.city').trim().notEmpty(),
//     body('location.state').trim().notEmpty(),
// ], async (req, res, next) => {
//     // Your registration logic here...
// });

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// router.post('/login', [
//   body('email').isEmail().normalizeEmail(),
//   body('password').notEmpty()
// ], async (req, res, next) => {
//     // Your login logic here...
// });

// // @desc    Get current user profile
// // @route   GET /api/auth/me
// // @access  Private
// router.get('/me', protect, async (req, res, next) => {
//     // Your /me logic here...
// });

// // @desc    Forgot password
// // @route   POST /api/auth/forgot-password
// // @access  Public
// // router.post('/forgot-password', async (req, res) => {
// //   try {
// //     const user = await User.findOne({ email: req.body.email });
// //     if (!user) {
// //       return res.status(200).json({
// //         success: true,
// //         message: 'If a user with that email exists, a reset link has been sent.',
// //       });
// //     }

// //     const resetToken = user.createPasswordResetToken();
// //     await user.save({ validateBeforeSave: false });

// //     // --- 🔽 THIS IS THE FINAL FIX 🔽 ---
// //     // Use the dynamic origin, but fall back to the .env variable if it's undefined
// //     const origin = req.get('origin') || process.env.FRONTEND_URL;
// //     const resetURL = `${origin}/reset-password/${resetToken}`;
// //     // --- 🔼 END OF FIX 🔼 ---

// //     const message = `
// //       <h1>Password Reset Request</h1>
// //       <p>Please click the link below to reset your password. It is valid for 10 minutes.</p>
// //       <a href="${resetURL}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
// //         Reset Password
// //       </a>
// //     `;

// //     await sendEmail({
// //       email: user.email,
// //       subject: 'Your JeevanSetu Password Reset Link',
// //       message,
// //     });

// //     res.status(200).json({
// //       success: true,
// //       message: 'If a user with that email exists, a reset link has been sent.',
// //     });

// //   } catch (err) {
// //     console.error('FORGOT PASSWORD ERROR:', err);
// //     res.status(500).json({
// //       success: false,
// //       message: 'There was an error sending the email. Please try again later.',
// //     });
// //   }
// // });
// router.post('/forgot-password', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res.status(200).json({
//         success: true,
//         message: 'If a user with that email exists, a reset link has been sent.',
//       });
//     }

//     const resetToken = user.createPasswordResetToken();
//     await user.save({ validateBeforeSave: false });

//     // --- 🔽 THIS IS THE FIX 🔽 ---
//     // Use the dynamic origin, but fall back to the .env variable if it's undefined
//     const origin = req.get('origin') || process.env.FRONTEND_URL;
//     const resetURL = `${origin}/reset-password/${resetToken}`;
//     // --- 🔼 END OF FIX 🔼 ---

//     const message = `
//       <h1>Password Reset Request</h1>
//       <p>Please click the link below to reset your password. It is valid for 10 minutes.</p>
//       <a href="${resetURL}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
//         Reset Password
//       </a>
//     `;

//     await sendEmail({
//       email: user.email,
//       subject: 'Your JeevanSetu Password Reset Link',
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: 'If a user with that email exists, a reset link has been sent.',
//     });

//   } catch (err) {
//     console.error('FORGOT PASSWORD ERROR:', err);
//     res.status(500).json({
//       success: false,
//       message: 'There was an error sending the email. Please try again later.',
//     });
//   }
// });


// // @desc    Reset password
// // @route   PUT /api/auth/reset-password/:token
// // @access  Public
// router.put('/reset-password/:token', [
//     body('password').isLength({ min: 6 })
// ], async (req, res, next) => {
//     // Your reset password logic here...
// });

// module.exports = router;
const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Doctor = require('../models/Doctor');
const NGO = require('../models/NGO');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
    body('name').trim().isLength({ min: 2 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').matches(/^[6-9]\d{9}$/),
    body('role').isIn(['patient', 'donor', 'doctor', 'ngo']),
    body('location.city').trim().notEmpty(),
    body('location.state').trim().notEmpty(),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
        }
        const { name, email, password, phone, role, bloodType, location } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }
        const user = await User.create({ name, email, password, phone, role, bloodType, location });
        let roleProfile = null;
        switch (role) {
            case 'donor':
                roleProfile = await Donor.create({ userId: user._id, bloodType: user.bloodType, age: req.body.age, weight: req.body.weight });
                break;
            case 'doctor':
                roleProfile = await Doctor.create({ userId: user._id, specialization: req.body.specialization, licenseNumber: req.body.licenseNumber, experience: req.body.experience, hospital: { name: req.body.hospitalName } });
                break;
            case 'ngo':
                roleProfile = await NGO.create({ userId: user._id, organizationName: req.body.organizationName, registrationNumber: req.body.registrationNumber, type: 'ngo', address: { city: location.city, state: location.state }, contactInfo: { primaryPhone: user.phone, email: user.email } });
                break;
        }
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user, roleProfile, token }
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account is deactivated.' });
        }
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        const token = generateToken(user._id);
        res.json({ success: true, message: 'Login successful', data: { user, token } });
    } catch (error) {
        next(error);
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          return res.json({ success: true, message: 'If a user with that email exists, a reset link has been sent.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save({ validateBeforeSave: false });

        const origin = req.get('origin') || process.env.FRONTEND_URL;
        const resetURL = `${origin}/reset-password/${resetToken}`;

        const message = `
          <h1>Password Reset Request</h1>
          <p>Please click the link below to reset your password. It is valid for 10 minutes.</p>
          <a href="${resetURL}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        `;

        await sendEmail({
            name: user.name,
            email: user.email,
            subject: 'Your JeevanSetu Password Reset Link',
            message,
        });

        res.status(200).json({
            success: true,
            message: 'If a user with that email exists, a reset link has been sent.',
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
router.put('/reset-password/:token', [
    body('password').isLength({ min: 6 })
], async (req, res, next) => {
    try {
        const passwordResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            passwordResetToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;