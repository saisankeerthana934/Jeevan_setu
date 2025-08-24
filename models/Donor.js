const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  donorId: {
    type: String,
    unique: true,
    required: false
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: [18, 'Donor must be at least 18 years old'],
    max: [65, 'Donor must be under 65 years old']
  },
  weight: {
    type: Number,
    required: true,
    min: [50, 'Donor must weigh at least 50kg']
  },
  lastDonation: {
    type: Date
  },
  donationHistory: [{
    date: {
      type: Date,
      required: true
    },
    location: {
      hospital: String,
      city: String
    },
    units: {
      type: Number,
      default: 1
    },
    bloodType: String,
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: Date,
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime'
    },
    maxDistance: {
      type: Number,
      default: 50 // kilometers
    }
  },
  medicalInfo: {
    conditions: [String],
    medications: [String],
    allergies: [String],
    lastCheckup: Date,
    hemoglobin: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    }
  },
  statistics: {
    totalDonations: {
      type: Number,
      default: 0
    },
    livesImpacted: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0 // in hours
    }
  },
  certifications: [{
    type: {
      type: String,
      enum: ['regular_donor', 'voluntary_donor', 'emergency_donor']
    },
    issuedDate: Date,
    issuedBy: String
  }],
  isEligible: {
    type: Boolean,
    default: true
  },
  nextEligibleDate: Date
}, {
  timestamps: true
});

// Generate donor ID before saving
donorSchema.pre('save', async function(next) {
  if (!this.donorId) {
    const count = await mongoose.model('Donor').countDocuments();
    this.donorId = `DN${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate next eligible date (56 days after last donation for males, 84 days for females)
  if (this.lastDonation) {
    const daysToAdd = 56; // Default for males, can be adjusted based on gender
    this.nextEligibleDate = new Date(this.lastDonation.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    this.isEligible = new Date() >= this.nextEligibleDate;
  }
  
  next();
});

// Calculate eligibility based on last donation
donorSchema.methods.calculateEligibility = function() {
  if (!this.lastDonation) return true;
  
  const daysSinceLastDonation = Math.floor((new Date() - this.lastDonation) / (1000 * 60 * 60 * 24));
  return daysSinceLastDonation >= 56; // Minimum 56 days between donations
};

// Update statistics
donorSchema.methods.updateStatistics = function(responseTime) {
  this.statistics.totalDonations += 1;
  this.statistics.livesImpacted += 1; // Assuming each donation impacts one life
  
  // Update average response time
  if (responseTime) {
    const currentAvg = this.statistics.averageResponseTime || 0;
    const totalResponses = this.statistics.totalDonations;
    this.statistics.averageResponseTime = ((currentAvg * (totalResponses - 1)) + responseTime) / totalResponses;
  }
};

module.exports = mongoose.model('Donor', donorSchema);