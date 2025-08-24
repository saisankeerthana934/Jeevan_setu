const mongoose = require('mongoose');

const campaignDraftSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true,
  },
  predictedShortage: {
    city: String,
    bloodType: String,
  },
  aiGeneratedPlan: {
    campaignTitle: String,
    campaignDescription: String,
    suggestedVenue: String,
    targetParticipants: Number,
    emailSubject: String,
    emailBody: String,
    socialMediaPost: String,
  },
  status: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected'],
    default: 'pending_approval',
  },
}, { timestamps: true });

module.exports = mongoose.model('CampaignDraft', campaignDraftSchema);