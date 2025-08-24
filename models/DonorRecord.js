const mongoose = require('mongoose');

const donorRecordSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true },
  role: String,
  bloodGroup: { type: String, index: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    // Note: MongoDB requires coordinates in [longitude, latitude] order
    coordinates: { type: [Number], index: '2dsphere' } 
  },
  lastDonationDate: Date,
  nextEligibleDate: Date,
  eligibilityStatus: String,
  donationsTillDate: Number,
  totalCalls: Number,
  callsToDonationsRatio: Number,
});

module.exports = mongoose.model('DonorRecord', donorRecordSchema);