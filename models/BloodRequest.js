const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  unitsRequired: {
    type: Number,
    required: true,
    min: [1, 'At least 1 unit is required'],
    max: [10, 'Maximum 10 units can be requested']
  },
  urgency: {
    type: String,
    enum: ['critical', 'high', 'moderate', 'routine'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'partially_fulfilled', 'cancelled', 'expired'],
    default: 'active'
  },
  hospital: {
    name: { type: String, required: true },
    city: String,
    state: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    contactNumber: String
  },
  requiredBy: {
    type: Date,
    required: true
    
  },
  doctor: {
    name: String,
    phone: String,
    specialization: String,
    licenseNumber: String
  },
  patientCondition: {
    currentCondition: String,
    hemoglobinLevel: Number,
    lastTransfusion: Date,
    medicalHistory: [String],
    criticalNotes: String
  },
  matchedDonors: [{
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
    matchScore: Number,
    distance: Number,
    contactedAt: Date,
    response: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'no_response'],
      default: 'pending'
    },
    responseTime: Number,
    donationScheduled: {
      date: Date,
      time: String,
      location: String
    }
  }],
  donations: [{
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
    units: Number,
    donationDate: Date,
    hospital: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled'
    }
  }],
  notifications: [{
    type: { type: String, enum: ['sms', 'email', 'push', 'call'] },
    recipient: String,
    message: String,
    sentAt: Date,
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed'],
      default: 'sent'
    }
  }],
  aiPrediction: {
    estimatedFulfillmentTime: Number,
    recommendedActions: [String],
    riskScore: Number,
    alternativeBloodTypes: [String]
  },
  additionalNotes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fulfillmentDetails: {
    fulfilledAt: Date,
    totalUnitsReceived: Number,
    averageResponseTime: Number,
    successRate: Number
  }
}, { timestamps: true });

// Auto-generate requestId
bloodRequestSchema.pre('save', async function (next) {
  if (!this.requestId) {
    const count = await mongoose.model('BloodRequest').countDocuments();
    const urgencyPrefix = {
      'critical': 'CR',
      'high': 'HG',
      'moderate': 'MD',
      'routine': 'RT'
    };
    this.requestId = `${urgencyPrefix[this.urgency]}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Check if expired
bloodRequestSchema.methods.isExpired = function () {
  return new Date() > this.requiredBy && this.status === 'active';
};

// Fulfillment %
bloodRequestSchema.methods.getFulfillmentPercentage = function () {
  const totalReceived = this.donations.reduce((sum, donation) => {
    return donation.status === 'completed' ? sum + donation.units : sum;
  }, 0);
  return (totalReceived / this.unitsRequired) * 100;
};

// Update status
bloodRequestSchema.methods.updateStatus = function () {
  const fulfillmentPercentage = this.getFulfillmentPercentage();
  if (fulfillmentPercentage >= 100) {
    this.status = 'fulfilled';
    this.fulfillmentDetails.fulfilledAt = new Date();
  } else if (fulfillmentPercentage > 0) {
    this.status = 'partially_fulfilled';
  } else if (this.isExpired()) {
    this.status = 'expired';
  }
};

// Indexes
bloodRequestSchema.index({ "hospital.coordinates": "2dsphere" });
bloodRequestSchema.index({ bloodType: 1, status: 1, urgency: 1 });
bloodRequestSchema.index({ requiredBy: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
