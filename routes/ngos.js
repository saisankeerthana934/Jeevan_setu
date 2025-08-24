const express = require('express');
const { body, validationResult, query } = require('express-validator');
const NGO = require('../models/NGO');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const CampaignDraft = require('../models/CampaignDraft');
const { generateCampaignPlan } = require('../services/aiService');
const Donor = require('../models/Donor');
const router = express.Router();

// @desc    Get NGO profile
// @route   GET /api/ngos/profile
// @access  Private (NGO)
router.get('/profile', protect, authorize('ngo'), async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone location isVerified')
      .populate('volunteers.volunteer', 'name phone location')
      .populate('partnerships.partner', 'name role');

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    res.json({
      success: true,
      data: { ngo }
    });

  } catch (error) {
    console.error('Get NGO profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching NGO profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update NGO profile
// @route   PUT /api/ngos/profile
// @access  Private (NGO)
router.put('/profile', protect, authorize('ngo'), [
  body('organizationName').optional().trim().isLength({ min: 2 }),
  body('type').optional().isIn(['ngo', 'charity', 'foundation', 'trust', 'society']),
  body('focusAreas').optional().isArray()
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

    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    const allowedUpdates = [
      'organizationName', 'type', 'focusAreas', 'address', 
      'contactInfo', 'resources'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'object' && !Array.isArray(req.body[field])) {
          ngo[field] = { ...ngo[field].toObject(), ...req.body[field] };
        } else {
          ngo[field] = req.body[field];
        }
      }
    });

    await ngo.save();

    res.json({
      success: true,
      message: 'NGO profile updated successfully',
      data: { ngo }
    });

  } catch (error) {
    console.error('Update NGO profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating NGO profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get NGO campaigns
// @route   GET /api/ngos/campaigns
// @access  Private (NGO)
router.get('/campaigns', protect, authorize('ngo'), [
  query('status').optional().isIn(['planned', 'active', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    let campaigns = ngo.campaigns;
    
    if (req.query.status) {
      campaigns = campaigns.filter(campaign => campaign.status === req.query.status);
    }

    // Sort by start date (most recent first)
    campaigns.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    res.json({
      success: true,
      data: { campaigns }
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching campaigns',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Create new campaign
// @route   POST /api/ngos/campaigns
// @access  Private (NGO)
router.post('/campaigns', protect, authorize('ngo'), [
  body('title').trim().isLength({ min: 5 }).withMessage('Campaign title must be at least 5 characters'),
  body('description').optional().trim(),
  body('type').isIn(['blood_drive', 'awareness', 'fundraising', 'medical_camp', 'education']),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('location.city').trim().notEmpty().withMessage('Campaign city is required'),
  body('targetParticipants').optional().isInt({ min: 1 })
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

    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    const {
      title, description, type, startDate, endDate, location, 
      targetParticipants, budget
    } = req.body;

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const newCampaign = {
      title,
      description,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      location,
      targetParticipants: targetParticipants || 50,
      budget: budget || { allocated: 0, spent: 0 },
      status: 'planned'
    };

    ngo.campaigns.push(newCampaign);
    ngo.updateStatistics();
    await ngo.save();

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: {
        campaign: ngo.campaigns[ngo.campaigns.length - 1]
      }
    });

  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating campaign',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update campaign
// @route   PUT /api/ngos/campaigns/:campaignId
// @access  Private (NGO)
router.put('/campaigns/:campaignId', protect, authorize('ngo'), [
  body('title').optional().trim().isLength({ min: 5 }),
  body('status').optional().isIn(['planned', 'active', 'completed', 'cancelled']),
  body('actualParticipants').optional().isInt({ min: 0 }),
  body('bloodCollected').optional().isInt({ min: 0 })
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const ngo = await NGO.findOne({ userId: req.user.id });
        if (!ngo) {
            return res.status(404).json({ success: false, message: 'NGO profile not found' });
        }

        const campaign = ngo.campaigns.id(req.params.campaignId);
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        // --- 🔽 THIS IS THE FIX 🔽 ---
        // Update any of the allowed fields if they are provided in the request body
        const allowedUpdates = ['title', 'description', 'status', 'actualParticipants', 'bloodCollected'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                campaign[field] = req.body[field];
            }
        });
        // --- 🔼 END OF FIX 🔼 ---

        ngo.updateStatistics();
        await ngo.save();
        
        res.json({ 
            success: true, 
            message: 'Campaign updated successfully',
            data: { campaign } 
        });
    } catch (error) {
        next(error);
    }
});


// @desc    Get NGO volunteers
// @route   GET /api/ngos/volunteers
// @access  Private (NGO)
router.get('/volunteers', protect, authorize('ngo'), async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id })
      .populate('volunteers.volunteer', 'name phone location profile');

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    const activeVolunteers = ngo.volunteers.filter(v => v.isActive);

    res.json({
      success: true,
      data: {
        volunteers: activeVolunteers,
        totalVolunteers: ngo.volunteers.length,
        activeVolunteers: activeVolunteers.length
      }
    });

  } catch (error) {
    console.error('Get volunteers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching volunteers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Add volunteer
// @route   POST /api/ngos/volunteers
// @access  Private (NGO)
router.post('/volunteers', protect, authorize('ngo'), [
  body('volunteerId').isMongoId().withMessage('Valid volunteer ID required'),
  body('role').isIn(['coordinator', 'medical', 'logistics', 'communication', 'general']),
  body('skills').optional().isArray()
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

    const { volunteerId, role, skills, availability } = req.body;

    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    // Check if volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    // Check if volunteer is already added
    const existingVolunteer = ngo.volunteers.find(v => v.volunteer.toString() === volunteerId);
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer is already part of your organization'
      });
    }

    ngo.volunteers.push({
      volunteer: volunteerId,
      role,
      skills: skills || [],
      availability: availability || { days: [], hours: '' }
    });

    ngo.updateStatistics();
    await ngo.save();

    await ngo.populate('volunteers.volunteer', 'name phone location');

    res.status(201).json({
      success: true,
      message: 'Volunteer added successfully',
      data: {
        volunteer: ngo.volunteers[ngo.volunteers.length - 1]
      }
    });

  } catch (error) {
    console.error('Add volunteer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding volunteer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
router.get('/volunteers', protect, authorize('ngo'), async (req, res, next) => {
    try {
        const ngo = await NGO.findOne({ userId: req.user.id })
            .populate('volunteers.volunteer', 'name phone email location'); // Added email

        if (!ngo) {
            return res.status(404).json({ success: false, message: 'NGO profile not found' });
        }

        const activeVolunteers = ngo.volunteers.filter(v => v.isActive);
        res.json({
            success: true,
            data: { volunteers: activeVolunteers }
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Add volunteer by email
// @route   POST /api/ngos/volunteers
// @access  Private (NGO)
router.post('/volunteers', protect, authorize('ngo'), [
    // --- 🔽 THIS IS THE FIX 🔽 ---
    // We now validate an email instead of a volunteerId
    body('email').isEmail().withMessage('Please provide a valid volunteer email'),
    body('role').isIn(['coordinator', 'medical', 'logistics', 'communication', 'general']),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, role, skills } = req.body;

        const ngo = await NGO.findOne({ userId: req.user.id });
        if (!ngo) {
            return res.status(404).json({ success: false, message: 'NGO profile not found' });
        }

        // Find the user by email to get their ID
        const volunteerUser = await User.findOne({ email });
        if (!volunteerUser) {
            return res.status(404).json({ success: false, message: 'No user found with this email. Please ask them to register on JeevanSetu first.' });
        }

        const isAlreadyVolunteer = ngo.volunteers.some(v => v.volunteer.toString() === volunteerUser._id.toString());
        if (isAlreadyVolunteer) {
            return res.status(400).json({ success: false, message: 'This user is already a volunteer for your organization.' });
        }

        ngo.volunteers.push({
            volunteer: volunteerUser._id,
            role,
            skills: skills || [],
        });

        ngo.updateStatistics();
        await ngo.save();

        // Populate the new volunteer's details for the response
        await ngo.populate('volunteers.volunteer', 'name phone email');

        res.status(201).json({
            success: true,
            message: `${volunteerUser.name} has been added as a volunteer.`,
            data: { volunteers: ngo.volunteers }
        });

    } catch (error) {
        next(error);
    }
});


// @desc    Get NGO statistics
// @route   GET /api/ngos/stats
// @access  Private (NGO)
router.get('/stats', protect, authorize('ngo'), async (req, res, next) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user.id });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO profile not found'
      });
    }

    // --- 🔽 THIS IS THE FIX 🔽 ---
    // The two lines that modified and saved the document have been removed.
    // We will now calculate stats based on the current state of the document
    // without changing it.
    
    // Calculate additional metrics for the response
    const impactScore = ngo.getImpactScore();
    const activeCampaigns = ngo.campaigns.filter(c => c.status === 'active');
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyCampaigns = ngo.campaigns.filter(campaign => {
      const campaignDate = new Date(campaign.startDate);
      return campaignDate.getMonth() === currentMonth && campaignDate.getFullYear() === currentYear;
    }).length;

    res.json({
      success: true,
      data: {
        statistics: ngo.statistics, // Send the currently saved statistics
        impactScore: Math.round(impactScore * 100) / 100,
        activeCampaigns: activeCampaigns.length,
        monthlyCampaigns,
        organizationInfo: {
          name: ngo.organizationName,
          type: ngo.type,
          focusAreas: ngo.focusAreas,
          isVerified: ngo.isVerified
        }
      }
    });

  } catch (error) {
    next(error);
  }
});
router.delete('/campaigns/:campaignId', protect, authorize('ngo'), async (req, res, next) => {
    try {
        const ngo = await NGO.findOne({ userId: req.user.id });
        if (!ngo) {
            return res.status(404).json({ success: false, message: 'NGO profile not found' });
        }
        
        // Use .pull() to remove the subdocument directly from the array by its ID
        ngo.campaigns.pull(req.params.campaignId);
        
        // Update the main document's statistics
        ngo.updateStatistics();
        await ngo.save();

        res.json({
            success: true,
            message: 'Campaign deleted successfully'
        });

    } catch (error) {
        next(error);
    }
});
router.post('/campaigns/generate-ai-draft', protect, authorize('ngo'), [
    body('city').trim().notEmpty(),
    body('bloodType').trim().notEmpty(),
], async (req, res) => {
    try {
        const { city, bloodType } = req.body;

        // 1. Analyze available donors (simple count for now)
        const donorCount = await Donor.countDocuments({ 
            'availability.isAvailable': true,
            isEligible: true
        });

        // 2. Call the AI service to generate a plan
        const aiPlan = await generateCampaignPlan({ city, bloodType, donorCount });

        if (!aiPlan) {
            return res.status(500).json({ success: false, message: 'AI strategist failed to generate a plan. Please try again.' });
        }

        // 3. Save the plan as a draft for the NGO to approve
        const ngoProfile = await NGO.findOne({ userId: req.user.id });
        const draft = await CampaignDraft.create({
            ngo: ngoProfile._id,
            predictedShortage: { city, bloodType },
            aiGeneratedPlan: aiPlan,
        });

        res.status(201).json({ 
            success: true, 
            message: 'AI has generated a new campaign draft for your review!',
            data: draft 
        });

    } catch (error) {
        console.error("Error generating AI campaign draft:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
router.get('/campaign-drafts', protect, authorize('ngo'), async (req, res) => {
    try {
        const ngoProfile = await NGO.findOne({ userId: req.user.id });
        if (!ngoProfile) {
            return res.status(404).json({ success: false, message: 'NGO profile not found.' });
        }
        const drafts = await CampaignDraft.find({ 
            ngo: ngoProfile._id, 
            status: 'pending_approval' 
        });
        res.status(200).json({ success: true, data: drafts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Approve a draft and create a real campaign from it
// @route   POST /api/ngos/campaign-drafts/:draftId/approve
// @access  Private (NGO)
router.post('/campaign-drafts/:draftId/approve', protect, authorize('ngo'), async (req, res) => {
    try {
        const draft = await CampaignDraft.findById(req.params.draftId);
        const ngo = await NGO.findOne({ userId: req.user.id });

        if (!draft || !ngo || draft.ngo.toString() !== ngo._id.toString()) {
            return res.status(404).json({ success: false, message: 'Draft not found or not authorized.' });
        }
        
        // 1. Create a new campaign from the AI plan
        const plan = draft.aiGeneratedPlan;
        const newCampaign = {
            title: plan.campaignTitle,
            description: plan.campaignDescription,
            type: 'blood_drive', // Default type
            location: {
                city: draft.predictedShortage.city,
                venue: plan.suggestedVenue,
            },
            targetParticipants: plan.targetParticipants,
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Set to 2 weeks from now
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),   // Set to 2 weeks and 1 day from now
        };
        ngo.campaigns.push(newCampaign);
        
        // 2. Delete the draft now that it's approved
        await CampaignDraft.findByIdAndDelete(req.params.draftId);
        
        await ngo.save();
        
        res.status(200).json({ success: true, message: 'Campaign approved and created successfully!' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
router.get('/campaigns/:campaignId', protect, authorize('ngo'), async (req, res, next) => {
    try {
        const ngo = await NGO.findOne({ userId: req.user.id });
        if (!ngo) {
            return res.status(404).json({ success: false, message: 'NGO profile not found.' });
        }

        // Find the specific campaign within the NGO's campaigns array using its ID
        const campaign = ngo.campaigns.id(req.params.campaignId);
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found.' });
        }

        res.json({
            success: true,
            data: { campaign }
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { body, validationResult } = require('express-validator');

// // --- CONSOLIDATED IMPORTS ---
// const { protect, authorize } = require('../middleware/auth');
// const Campaign = require('../models/Campaign');
// const CampaignDraft = require('../models/CampaignDraft');
// const NGO = require('../models/NGO');
// const User = require('../models/User');
// const Volunteer = require('../models/Volunteer');

// // --- PROFILE MANAGEMENT ---

// // @desc    Get NGO profile
// // @route   GET /api/ngos/profile
// router.get('/profile', protect, authorize('ngo'), async (req, res, next) => {
//     try {
//         const ngo = await NGO.findOne({ userId: req.user.id }).populate('userId', 'name email phone');
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found' });
//         }
//         res.json({ success: true, data: ngo });
//     } catch (error) {
//         next(error);
//     }
// });

// // @desc    Update NGO profile
// // @route   PUT /api/ngos/profile
// router.put('/profile', protect, authorize('ngo'), [
//     body('organizationName').optional().trim().isLength({ min: 2 }),
//     body('address.city').optional().trim().notEmpty(),
//     body('address.state').optional().trim().notEmpty(),
// ], async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, errors: errors.array() });
//         }
//         const ngo = await NGO.findOneAndUpdate({ userId: req.user.id }, req.body, {
//             new: true,
//             runValidators: true
//         });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found' });
//         }
//         res.json({ success: true, data: ngo });
//     } catch (error) {
//         next(error);
//     }
// });


// // --- CAMPAIGN MANAGEMENT ---

// // @desc    Create a new campaign
// // @route   POST /api/ngos/campaigns
// router.post('/campaigns', protect, authorize('ngo'), [
//     body('title').trim().isLength({ min: 5 }),
//     body('description').optional().trim(),
//     body('location.city').trim().notEmpty(),
//     body('startDate').isISO8601(),
//     body('endDate').isISO8601(),
// ], async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, errors: errors.array() });
//         }
//         const ngo = await NGO.findOne({ userId: req.user.id });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found' });
//         }
        
//         const newCampaign = { 
//             ...req.body, 
//             description: req.body.description || `A new campaign: ${req.body.title}`,
//         };

//         ngo.campaigns.push(newCampaign);
//         await ngo.save();

//         const createdCampaign = ngo.campaigns[ngo.campaigns.length - 1];
//         res.status(201).json({ success: true, data: createdCampaign });
//     } catch (error) {
//         next(error);
//     }
// });

// // @desc    Get all campaigns for an NGO
// // @route   GET /api/ngos/campaigns
// router.get('/campaigns', protect, authorize('ngo'), async (req, res, next) => {
//     try {
//         const ngo = await NGO.findOne({ userId: req.user.id });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found' });
//         }
//         const campaigns = (ngo.campaigns || []).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
//         res.json({ success: true, data: { campaigns } });
//     } catch (error) {
//         next(error);
//     }
// });

// // @desc    Update a campaign
// // @route   PUT /api/ngos/campaigns/:campaignId
// router.put('/campaigns/:campaignId', protect, authorize('ngo'), async (req, res, next) => {
//     try {
//         const ngo = await NGO.findOne({ userId: req.user.id });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO not found' });
//         }

//         const campaign = ngo.campaigns.id(req.params.campaignId);
//         if (!campaign) {
//             return res.status(404).json({ success: false, message: 'Campaign not found' });
//         }

//         Object.assign(campaign, req.body);
//         await ngo.save();
        
//         res.json({ success: true, data: campaign });
//     } catch (error) {
//         next(error);
//     }
// });

// // @desc    Delete a campaign
// // @route   DELETE /api/ngos/campaigns/:campaignId
// router.delete('/campaigns/:campaignId', protect, authorize('ngo'), async (req, res, next) => {
//     try {
//         const ngo = await NGO.findOne({ userId: req.user.id });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO not found' });
//         }

//         ngo.campaigns.pull(req.params.campaignId);
//         await ngo.save();

//         res.json({ success: true, message: 'Campaign deleted successfully' });
//     } catch (error)
//  {
//         next(error);
//     }
// });


// // --- VOLUNTEER MANAGEMENT ---

// // @desc    Recruit a new volunteer by email
// // @route   POST /api/ngos/volunteers
// router.post('/volunteers', protect, authorize('ngo'), [
//     body('email').isEmail().withMessage('Please provide a valid email'),
//     body('role').isIn(['general', 'coordinator', 'medical', 'logistics', 'communication']),
// ], async (req, res, next) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ success: false, errors: errors.array() });
//         }
//         const { email, role } = req.body;
//         const ngo = await NGO.findOne({ userId: req.user.id });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found' });
//         }
//         const userToRecruit = await User.findOne({ email });
//         if (!userToRecruit) {
//             return res.status(404).json({ success: false, message: 'User with this email not found.' });
//         }
        
//         const isAlreadyVolunteer = await Volunteer.findOne({ user: userToRecruit._id, ngo: ngo._id });
//         if (isAlreadyVolunteer) {
//             return res.status(400).json({ success: false, message: 'This user is already a volunteer.' });
//         }

//         const newVolunteer = await Volunteer.create({
//             user: userToRecruit._id,
//             ngo: ngo._id,
//             role: role
//         });
//         res.status(201).json({ success: true, data: newVolunteer });
//     } catch (error) {
//         next(error);
//     }
// });

// // @desc    Get all volunteers for an NGO
// // @route   GET /api/ngos/volunteers
// router.get('/volunteers', protect, authorize('ngo'), async (req, res, next) => {
//     try {
//         const ngo = await NGO.findOne({ userId: req.user.id });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found' });
//         }
//         const volunteers = await Volunteer.find({ ngo: ngo._id }).populate('user', 'name email');
//         res.json({ success: true, data: { volunteers } });
//     } catch (error) {
//         next(error);
//     }
// });


// // --- STATISTICS ---

// // @desc    Get NGO statistics
// // @route   GET /api/ngos/stats
// router.get('/stats', protect, authorize('ngo'), async (req, res, next) => {
//     try {
//         const ngo = await NGO.findOne({ userId: req.user.id });
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found' });
//         }
//         const campaigns = ngo.campaigns || [];
//         const stats = {
//             activeCampaigns: campaigns.filter(c => c.status === 'active').length,
//             totalVolunteers: await Volunteer.countDocuments({ ngo: ngo._id }),
//             patientsHelped: 0, // Placeholder
//             bloodUnitsCollected: campaigns.reduce((acc, c) => acc + (c.bloodCollected || 0), 0)
//         };
//         res.json({ success: true, data: { statistics: stats } });
//     } catch (error) {
//         next(error);
//     }
// });


// // --- AI STRATEGIST ROUTES ---

// // @desc    Get all pending campaign drafts for the logged-in NGO
// // @route   GET /api/ngos/campaign-drafts
// router.get('/campaign-drafts', protect, authorize('ngo'), async (req, res) => {
//     try {
//         const ngoProfile = await NGO.findOne({ userId: req.user.id });
//         if (!ngoProfile) {
//             return res.status(404).json({ success: false, message: 'NGO profile not found for this user.' });
//         }
//         const drafts = await CampaignDraft.find({ ngo: ngoProfile._id, status: 'pending_approval' });
//         res.status(200).json({ success: true, data: drafts });
//     } catch (error) {
//         console.error("Error fetching campaign drafts:", error);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// });

// // @desc    Approve a draft and create a real campaign from it
// // @route   POST /api/ngos/campaign-drafts/:draftId/approve
// router.post('/campaign-drafts/:draftId/approve', protect, authorize('ngo'), async (req, res) => {
//     try {
//         const { draftId } = req.params;
//         const draft = await CampaignDraft.findById(draftId);
//         if (!draft) {
//             return res.status(404).json({ success: false, message: 'Draft not found' });
//         }
//         const plan = draft.aiGeneratedPlan;
        
//         const ngo = await NGO.findById(draft.ngo);
//         if (!ngo) {
//             return res.status(404).json({ success: false, message: 'Associated NGO not found.' });
//         }

//         const newCampaign = {
//             title: plan.campaignTitle,
//             description: plan.campaignDescription,
//             type: 'blood_drive',
//             status: 'planned',
//             location: {
//                 city: draft.predictedShortage.city,
//                 venue: plan.suggestedVenue,
//             },
//             targetParticipants: plan.targetParticipants,
//             startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//             endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
//         };

//         ngo.campaigns.push(newCampaign);
//         await ngo.save();
//         await CampaignDraft.findByIdAndDelete(draftId);
        
//         res.status(201).json({ success: true, message: 'Campaign approved and created!' });
//     } catch (error) {
//         console.error("Error approving campaign draft:", error);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// });

// module.exports = router;