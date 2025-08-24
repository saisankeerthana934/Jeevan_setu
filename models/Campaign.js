const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Campaign description is required'],
  },
  type: {
    type: String,
    enum: ['blood_drive', 'awareness', 'fundraising'],
    default: 'blood_drive',
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned',
  },
  location: {
    city: { type: String, required: true },
    venue: { type: String },
    address: { type: String },
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  targetParticipants: {
    type: Number,
    default: 0,
  },
  actualParticipants: {
    type: Number,
    default: 0,
  },
  bloodCollected: { // in units
    type: Number,
    default: 0,
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
  },
  outcomes: {
    livesImpacted: { type: Number, default: 0 },
    awarenessReach: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
