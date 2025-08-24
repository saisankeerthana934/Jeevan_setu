const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'blood_request',
      'donor_match',
      'appointment_reminder',
      'campaign_invitation',
      'donation_confirmation',
      'emergency_alert',
      'system_update',
      'welcome',
      'verification'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    bloodRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BloodRequest'
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor'
    },
    campaignId: String,
    appointmentId: String,
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  channels: {
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      status: String
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      status: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      status: String
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,
  expiresAt: Date,
  scheduledFor: Date
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Archive notification
notificationSchema.methods.archive = function() {
  this.isArchived = true;
  this.archivedAt = new Date();
  return this.save();
};

// Static method to create and send notification
notificationSchema.statics.createAndSend = async function(notificationData) {
  const notification = new this(notificationData);
  await notification.save();
  
  // Here you would integrate with actual notification services
  // For now, we'll just log the notification
  console.log(`Notification created: ${notification.title} for user ${notification.recipient}`);
  
  return notification;
};

// Static method to send bulk notifications
notificationSchema.statics.sendBulk = async function(recipients, notificationData) {
  const notifications = recipients.map(recipientId => ({
    ...notificationData,
    recipient: recipientId
  }));
  
  const createdNotifications = await this.insertMany(notifications);
  console.log(`Bulk notifications sent to ${recipients.length} users`);
  
  return createdNotifications;
};

module.exports = mongoose.model('Notification', notificationSchema);