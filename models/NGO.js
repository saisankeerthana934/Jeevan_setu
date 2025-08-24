// const mongoose = require('mongoose');

// const ngoSchema = new mongoose.Schema({
  
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true
//   },
//   ngoId: {
//     type: String,
//     unique: true,
//     required: false // This is the corrected line
//   },
//   organizationName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   registrationNumber: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   type: {
//     type: String,
//     enum: ['ngo', 'charity', 'foundation', 'trust', 'society'],
//     required: true
//   },
//   focusAreas: [{
//     type: String,
//     enum: [
//       'Thalassemia Support',
//       'Blood Donation',
//       'Healthcare',
//       'Patient Care',
//       'Medical Equipment',
//       'Education',
//       'Research',
//       'Community Outreach'
//     ]
//   }],
//   address: {
//     street: String,
//     city: {
//       type: String,
//       required: true
//     },
    
//     state: {
//       type: String,
//       required: true
//     },
//     pincode: String,
//     country: {
//       type: String,
//       default: 'India'
//     },
//     coordinates: {
//       latitude: Number,
//       longitude: Number
//     }
//   },
//   contactInfo: {
//     primaryPhone: {
//       type: String,
//       required: true
//     },
//     secondaryPhone: String,
//     email: {
//       type: String,
//       required: true
//     },
//     website: String,
//     socialMedia: {
//       facebook: String,
//       twitter: String,
//       instagram: String,
//       linkedin: String
//     }
//   },
//   campaigns: [{
//     title: {
//       type: String,
//       required: true
//     },
//     description: String,
//     type: {
//       type: String,
//       enum: ['blood_drive', 'awareness', 'fundraising', 'medical_camp', 'education']
//     },
//     startDate: Date,
//     endDate: Date,
//     location: {
//       venue: String,
//       city: String,
//       address: String
//     },
//     targetParticipants: Number,
//     actualParticipants: {
//       type: Number,
//       default: 0
//     },
//     bloodCollected: {
//       type: Number,
//       default: 0
//     },
//     status: {
//       type: String,
//       enum: ['planned', 'active', 'completed', 'cancelled'],
//       default: 'planned'
//     },
//     volunteers: [{
//       volunteer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//       },
//       role: String,
//       joinedAt: {
//         type: Date,
//         default: Date.now
//       }
//     }],
//     budget: {
//       allocated: Number,
//       spent: Number
//     },
//     outcomes: {
//       livesImpacted: Number,
//       awarenessReach: Number,
//       mediaReports: Number
//     }
//   }],
//   volunteers: [{
//     volunteer: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     role: {
//       type: String,
//       enum: ['coordinator', 'medical', 'logistics', 'communication', 'general']
//     },
//     joinedAt: {
//       type: Date,
//       default: Date.now
//     },
//     isActive: {
//       type: Boolean,
//       default: true
//     },
//     skills: [String],
//     availability: {
//       days: [String],
//       hours: String
//     },
//     contributions: {
//       hoursVolunteered: {
//         type: Number,
//         default: 0
//       },
//       campaignsParticipated: {
//         type: Number,
//         default: 0
//       },
//       donorsReferred: {
//         type: Number,
//         default: 0
//       }
//     }
//   }],
//   partnerships: [{
//     partner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     partnerType: {
//       type: String,
//       enum: ['hospital', 'blood_bank', 'ngo', 'government', 'corporate']
//     },
//     partnershipType: {
//       type: String,
//       enum: ['collaboration', 'funding', 'resource_sharing', 'awareness']
//     },
//     startDate: Date,
//     endDate: Date,
//     isActive: {
//       type: Boolean,
//       default: true
//     },
//     description: String
//   }],
//   resources: {
//     staff: {
//       fullTime: {
//         type: Number,
//         default: 0
//       },
//       partTime: {
//         type: Number,
//         default: 0
//       },
//       volunteers: {
//         type: Number,
//         default: 0
//       }
//     },
//     facilities: [{
//       type: {
//         type: String,
//         enum: ['office', 'medical_center', 'blood_bank', 'storage', 'vehicle']
//       },
//       description: String,
//       capacity: String,
//       location: String
//     }],
//     equipment: [{
//       name: String,
//       type: String,
//       quantity: Number,
//       condition: {
//         type: String,
//         enum: ['excellent', 'good', 'fair', 'needs_repair']
//       }
//     }]
//   },
//   statistics: {
//     totalCampaigns: {
//       type: Number,
//       default: 0
//     },
//     activeCampaigns: {
//       type: Number,
//       default: 0
//     },
//     totalVolunteers: {
//       type: Number,
//       default: 0
//     },
//     bloodUnitsCollected: {
//       type: Number,
//       default: 0
//     },
//     patientsHelped: {
//       type: Number,
//       default: 0
//     },
//     awarenessReach: {
//       type: Number,
//       default: 0
//     },
//     fundsRaised: {
//       type: Number,
//       default: 0
//     }
//   },
//   certifications: [{
//     name: String,
//     issuedBy: String,
//     issuedDate: Date,
//     expiryDate: Date,
//     certificateNumber: String,
//     documentUrl: String
//   }],
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   verificationDocuments: [{
//     type: {
//       type: String,
//       enum: ['registration', 'tax_exemption', 'fcra', 'other']
//     },
//     documentUrl: String,
//     uploadedAt: {
//       type: Date,
//       default: Date.now
//     },
//     verifiedAt: Date
//   }]
// }, {
//   timestamps: true
// });

// // Generate NGO ID before saving
// ngoSchema.pre('save', async function(next) {
//   if (!this.ngoId) {
//     // IMPROVEMENT: Use this.constructor for better practice
//     const count = await this.constructor.countDocuments();
//     this.ngoId = `NGO${String(count + 1).padStart(6, '0')}`;
//   }
//   next();
// });

// // Update statistics
// ngoSchema.methods.updateStatistics = function() {
//   this.statistics.totalCampaigns = this.campaigns.length;
//   this.statistics.activeCampaigns = this.campaigns.filter(c => c.status === 'active').length;
//   this.statistics.totalVolunteers = this.volunteers.filter(v => v.isActive).length;
//   this.statistics.bloodUnitsCollected = this.campaigns.reduce((sum, campaign) => sum + (campaign.bloodCollected || 0), 0);
//   this.statistics.patientsHelped = this.campaigns.reduce((sum, campaign) => sum + (campaign.outcomes?.livesImpacted || 0), 0);
//   this.statistics.awarenessReach = this.campaigns.reduce((sum, campaign) => sum + (campaign.outcomes?.awarenessReach || 0), 0);
// };

// // Get active campaigns
// ngoSchema.methods.getActiveCampaigns = function() {
//   return this.campaigns.filter(campaign => campaign.status === 'active');
// };

// // Calculate impact score
// ngoSchema.methods.getImpactScore = function() {
//   const weights = {
//     bloodUnits: 0.3,
//     patientsHelped: 0.25,
//     campaigns: 0.2,
//     volunteers: 0.15,
//     awarenessReach: 0.1
//   };
  
//   return (
//     (this.statistics.bloodUnitsCollected * weights.bloodUnits) +
//     (this.statistics.patientsHelped * weights.patientsHelped) +
//     (this.statistics.totalCampaigns * weights.campaigns) +
//     (this.statistics.totalVolunteers * weights.volunteers) +
//     (this.statistics.awarenessReach / 1000 * weights.awarenessReach)
//   );
// };

// module.exports = mongoose.model('NGO', ngoSchema);
const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  ngoId: {
    type: String,
    unique: true,
    required: false
  },
  organizationName: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['ngo', 'charity', 'foundation', 'trust', 'society'],
    required: true
  },
  focusAreas: [{
    type: String,
    enum: [
      'Thalassemia Support',
      'Blood Donation',
      'Healthcare',
      'Patient Care',
      'Medical Equipment',
      'Education',
      'Research',
      'Community Outreach'
    ]
  }],
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: String,
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    primaryPhone: {
      type: String,
      required: true
    },
    secondaryPhone: String,
    email: {
      type: String,
      required: true
    },
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String
    }
  },
  campaigns: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    type: {
      type: String,
      enum: ['blood_drive', 'awareness', 'fundraising', 'medical_camp', 'education']
    },
    startDate: Date,
    endDate: Date,
    location: {
      venue: String,
      city: String,
      address: String
    },
    targetParticipants: Number,
    actualParticipants: {
      type: Number,
      default: 0
    },
    bloodCollected: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'cancelled'],
      default: 'planned'
    },
    volunteers: [{
      volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String,
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }],
    budget: {
      allocated: Number,
      spent: Number
    },
    outcomes: {
      livesImpacted: Number,
      awarenessReach: Number,
      mediaReports: Number
    }
  }],
  volunteers: [{
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['coordinator', 'medical', 'logistics', 'communication', 'general']
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    skills: [String],
    availability: {
      days: [String],
      hours: String
    },
    contributions: {
      hoursVolunteered: {
        type: Number,
        default: 0
      },
      campaignsParticipated: {
        type: Number,
        default: 0
      },
      donorsReferred: {
        type: Number,
        default: 0
      }
    }
  }],
  partnerships: [{
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    partnerType: {
      type: String,
      enum: ['hospital', 'blood_bank', 'ngo', 'government', 'corporate']
    },
    partnershipType: {
      type: String,
      enum: ['collaboration', 'funding', 'resource_sharing', 'awareness']
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    description: String
  }],
  resources: {
    staff: {
      fullTime: {
        type: Number,
        default: 0
      },
      partTime: {
        type: Number,
        default: 0
      },
      volunteers: {
        type: Number,
        default: 0
      }
    },
    facilities: [{
      type: {
        type: String,
        enum: ['office', 'medical_center', 'blood_bank', 'storage', 'vehicle']
      },
      description: String,
      capacity: String,
      location: String
    }],
    equipment: [{
      name: String,
      type: String,
      quantity: Number,
      condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'needs_repair']
      }
    }]
  },
  statistics: {
    totalCampaigns: {
      type: Number,
      default: 0
    },
    activeCampaigns: {
      type: Number,
      default: 0
    },
    totalVolunteers: {
      type: Number,
      default: 0
    },
    bloodUnitsCollected: {
      type: Number,
      default: 0
    },
    patientsHelped: {
      type: Number,
      default: 0
    },
    awarenessReach: {
      type: Number,
      default: 0
    },
    fundsRaised: {
      type: Number,
      default: 0
    }
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    certificateNumber: String,
    documentUrl: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  // --- THIS FIELD WAS ADDED FROM OUR PREVIOUS STEP ---
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // --- END OF ADDITION ---
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['registration', 'tax_exemption', 'fcra', 'other']
    },
    documentUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date
  }]
}, {
  timestamps: true
});

// Generate NGO ID before saving
ngoSchema.pre('save', async function(next) {
  if (!this.ngoId) {
    const count = await this.constructor.countDocuments();
    this.ngoId = `NGO${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update statistics
ngoSchema.methods.updateStatistics = function() {
  this.statistics.totalCampaigns = this.campaigns.length;
  this.statistics.activeCampaigns = this.campaigns.filter(c => c.status === 'active').length;
  this.statistics.totalVolunteers = this.volunteers.filter(v => v.isActive).length;
  this.statistics.bloodUnitsCollected = this.campaigns.reduce((sum, campaign) => sum + (campaign.bloodCollected || 0), 0);
  this.statistics.patientsHelped = this.campaigns.reduce((sum, campaign) => sum + (campaign.outcomes?.livesImpacted || 0), 0);
  this.statistics.awarenessReach = this.campaigns.reduce((sum, campaign) => sum + (campaign.outcomes?.awarenessReach || 0), 0);
};

// Get active campaigns
ngoSchema.methods.getActiveCampaigns = function() {
  return this.campaigns.filter(campaign => campaign.status === 'active');
};

// Calculate impact score
ngoSchema.methods.getImpactScore = function() {
  const weights = {
    bloodUnits: 0.3,
    patientsHelped: 0.25,
    campaigns: 0.2,
    volunteers: 0.15,
    awarenessReach: 0.1
  };
  
  return (
    (this.statistics.bloodUnitsCollected * weights.bloodUnits) +
    (this.statistics.patientsHelped * weights.patientsHelped) +
    (this.statistics.totalCampaigns * weights.campaigns) +
    (this.statistics.totalVolunteers * weights.volunteers) +
    (this.statistics.awarenessReach / 1000 * weights.awarenessReach)
  );
};

module.exports = mongoose.model('NGO', ngoSchema);