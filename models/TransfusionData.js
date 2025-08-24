const mongoose = require('mongoose');

const transfusionDataSchema = new mongoose.Schema({
  donorId: { type: String, unique: true },
  donorBloodGroup: String,
  donorLocation: String,
  donorPhoneNumber: String,
  recency: Number, // months since last donation
  frequency: Number, // total number of donations
  monetary: Number, // total c.c. blood donated
  donatedInMarch2007: Boolean,
  patientId: String,
  patientBloodGroup: String,
  patientLocation: String,
  doctorId: String,
});

// Create an index for faster searching by location and blood group
transfusionDataSchema.index({ donorLocation: 1, donorBloodGroup: 1 });

module.exports = mongoose.model('TransfusionData', transfusionDataSchema);