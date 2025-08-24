// const mongoose = require('mongoose');

// const doctorSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     unique: true
//   },
//   doctorId: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   specialization: {
//     type: String,
//     required: true,
//     enum: [
//       'Hematology',
//       'Transfusion Medicine',
//       'Pediatric Hematology',
//       'Internal Medicine',
//       'General Practice',
//       'Emergency Medicine',
//       'Other'
//     ]
//   },
//   licenseNumber: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   experience: {
//     type: Number,
//     required: true,
//     min: [0, 'Experience cannot be negative']
//   },
//   hospital: {
//     name: {
//       type: String,
//       required: true
//     },
//     address: String,
//     city: String,
//     state: String,
//     type: {
//       type: String,
//       enum: ['government', 'private', 'charitable', 'corporate']
//     },
//     bedCapacity: Number,
//     hasBloodBank: {
//       type: Boolean,
//       default: false
//     }
//   },
//   patients: [{
//     patient: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     registeredAt: {
//       type: Date,
//       default: Date.now
//     },
//     condition: String,
//     lastVisit: Date,
//     nextAppointment: Date,
//     treatmentPlan: String,
//     notes: String
//   }],
//   bloodRequests: [{
//     request: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'BloodRequest'
//     },
//     role: {
//       type: String,
//       enum: ['primary', 'consulting', 'emergency'],
//       default: 'primary'
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   schedule: {
//     workingDays: [{
//       day: {
//         type: String,
//         enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
//       },
//       startTime: String,
//       endTime: String,
//       isAvailable: {
//         type: Boolean,
//         default: true
//       }
//     }],
//     emergencyAvailable: {
//       type: Boolean,
//       default: false
//     },
//     consultationFee: Number
//   },
//   qualifications: [{
//     degree: String,
//     institution: String,
//     year: Number,
//     specialization: String
//   }],
//   certifications: [{
//     name: String,
//     issuedBy: String,
//     issuedDate: Date,
//     expiryDate: Date,
//     certificateNumber: String
//   }],
//   statistics: {
//     totalPatients: {
//       type: Number,
//       default: 0
//     },
//     activePatients: {
//       type: Number,
//       default: 0
//     },
//     bloodRequestsHandled: {
//       type: Number,
//       default: 0
//     },
//     successfulTransfusions: {
//       type: Number,
//       default: 0
//     },
//     averageResponseTime: {
//       type: Number,
//       default: 0
//     },
//     patientSatisfactionRating: {
//       type: Number,
//       default: 0,
//       min: 0,
//       max: 5
//     }
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   verificationDocuments: [{
//     type: {
//       type: String,
//       enum: ['license', 'degree', 'hospital_id', 'other']
//     },
//     documentUrl: String,
//     uploadedAt: {
//       type: Date,
//       default: Date.now
//     },
//     verifiedAt: Date,
//     verifiedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   }],
//   preferences: {
//     notifications: {
//       newPatients: {
//         type: Boolean,
//         default: true
//       },
//       emergencyRequests: {
//         type: Boolean,
//         default: true
//       },
//       appointmentReminders: {
//         type: Boolean,
//         default: true
//       }
//     },
//     workload: {
//       maxPatientsPerDay: {
//         type: Number,
//         default: 20
//       },
//       acceptEmergencies: {
//         type: Boolean,
//         default: true
//       }
//     }
//   }
// }, {
//   timestamps: true
// });

// // Generate doctor ID before saving
// doctorSchema.pre('save', async function(next) {
//   if (!this.doctorId) {
//     const count = await mongoose.model('Doctor').countDocuments();
//     this.doctorId = `DR${String(count + 1).padStart(6, '0')}`;
//   }
//   next();
// });

// // Update statistics
// doctorSchema.methods.updateStatistics = function() {
//   this.statistics.totalPatients = this.patients.length;
//   this.statistics.activePatients = this.patients.filter(p => {
//     const lastVisit = new Date(p.lastVisit);
//     const threeMonthsAgo = new Date();
//     threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
//     return lastVisit > threeMonthsAgo;
//   }).length;
//   this.statistics.bloodRequestsHandled = this.bloodRequests.length;
// };

// // Check availability for a specific time
// doctorSchema.methods.isAvailableAt = function(dateTime) {
//   const dayName = dateTime.toLocaleDateString('en-US', { weekday: 'lowercase' });
//   const timeString = dateTime.toTimeString().slice(0, 5);
  
//   const daySchedule = this.schedule.workingDays.find(d => d.day === dayName);
//   if (!daySchedule || !daySchedule.isAvailable) return false;
  
//   return timeString >= daySchedule.startTime && timeString <= daySchedule.endTime;
// };

// module.exports = mongoose.model('Doctor', doctorSchema);
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  doctorId: {
    type: String,
    unique: true,
    required: false // CORRECTED: This was the bug
  },
  specialization: {
    type: String,
    required: true,
    enum: [
      'Hematology',
      'Transfusion Medicine',
      'Pediatric Hematology',
      'Internal Medicine',
      'General Practice',
      'Emergency Medicine',
      'Other'
    ]
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  experience: {
    type: Number,
    required: true,
    min: [0, 'Experience cannot be negative']
  },
  hospital: {
    name: { type: String, required: true }
  },
  // CORRECTED: Added the missing 'patients' array to the schema
  patients: [{
    patient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    registeredAt: { 
      type: Date, 
      default: Date.now 
    },
    condition: String,
    lastVisit: Date,
    nextAppointment: Date,
    treatmentPlan: String,
    notes: String
  }],
}, {
  timestamps: true
});

// Generate doctor ID before saving
doctorSchema.pre('save', async function(next) {
  if (!this.doctorId) {
    const count = await this.constructor.countDocuments();
    this.doctorId = `DR${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// ... (rest of methods are correct)

module.exports = mongoose.model('Doctor', doctorSchema);

