// AI-powered donor availability prediction using historical patterns

/**
 * Predict donor availability based on historical data and current conditions
 * @param {Object} donor - Donor object
 * @param {string} urgency - Request urgency level
 * @returns {Object} - Prediction result
 */
async function predictDonorAvailability(donor, urgency = 'moderate') {
  try {
    // Get current context
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();
    const currentMonth = new Date().getMonth();
    
    // Base availability score
    let availabilityScore = 0.5;

    // Factor 1: Donor's current availability status
    if (!donor.availability.isAvailable) {
      availabilityScore *= 0.1;
    } else {
      availabilityScore = 0.8;
    }

    // Factor 2: Last donation eligibility
    if (!donor.calculateEligibility()) {
      availabilityScore *= 0.2;
    }

    // Factor 3: Time-based patterns
    const timeFactors = getTimeBasedFactors(currentHour, currentDay, donor.availability.preferredTime);
    availabilityScore *= timeFactors.hourFactor * timeFactors.dayFactor * timeFactors.preferenceFactor;

    // Factor 4: Historical response rate
    const responseRate = donor.statistics.responseRate || 0.7;
    availabilityScore *= (0.5 + (responseRate * 0.5));

    // Factor 5: Distance and location factors
    const locationFactor = getLocationFactor(donor.availability.maxDistance);
    availabilityScore *= locationFactor;

    // Factor 6: Urgency multiplier
    const urgencyMultipliers = {
      critical: 1.3,
      high: 1.15,
      moderate: 1.0,
      routine: 0.85
    };
    availabilityScore *= urgencyMultipliers[urgency] || 1.0;

    // Factor 7: Seasonal patterns
    const seasonalFactor = getSeasonalFactor(currentMonth);
    availabilityScore *= seasonalFactor;

    // Factor 8: Donor fatigue (based on recent donations)
    const fatigueFactor = calculateDonorFatigue(donor.donationHistory);
    availabilityScore *= fatigueFactor;

    // Ensure score is between 0 and 1
    availabilityScore = Math.max(0, Math.min(1, availabilityScore));

    // Calculate estimated response time
    const baseResponseTime = getBaseResponseTime(urgency);
    const estimatedResponseTime = baseResponseTime / Math.max(availabilityScore, 0.1);

    // Generate recommendations
    const recommendations = generateRecommendations(donor, availabilityScore, urgency);

    return {
      availability: availabilityScore,
      estimatedResponseTime: Math.round(estimatedResponseTime * 100) / 100,
      confidence: calculateConfidence(donor),
      recommendations,
      factors: {
        eligibility: donor.calculateEligibility(),
        timeOfDay: timeFactors,
        responseHistory: responseRate,
        urgencyBoost: urgencyMultipliers[urgency],
        seasonal: seasonalFactor,
        fatigue: fatigueFactor
      }
    };

  } catch (error) {
    console.error('AI Prediction error:', error);
    // Return default prediction on error
    return {
      availability: 0.5,
      estimatedResponseTime: 6,
      confidence: 0.3,
      recommendations: ['Contact donor directly'],
      factors: {}
    };
  }
}

/**
 * Get time-based availability factors
 */
function getTimeBasedFactors(hour, day, preferredTime) {
  // Hour factor (0.5 to 1.2)
  let hourFactor = 1.0;
  if (hour >= 9 && hour <= 17) {
    hourFactor = 1.1; // Business hours
  } else if (hour >= 18 && hour <= 21) {
    hourFactor = 1.0; // Evening
  } else if (hour >= 22 || hour <= 6) {
    hourFactor = 0.5; // Late night/early morning
  }

  // Day factor (0.7 to 1.1)
  let dayFactor = 1.0;
  if (day === 0 || day === 6) {
    dayFactor = 0.8; // Weekend
  } else if (day >= 1 && day <= 5) {
    dayFactor = 1.0; // Weekday
  }

  // Preference factor
  let preferenceFactor = 1.0;
  if (preferredTime === 'morning' && hour >= 6 && hour <= 12) {
    preferenceFactor = 1.2;
  } else if (preferredTime === 'afternoon' && hour >= 12 && hour <= 17) {
    preferenceFactor = 1.2;
  } else if (preferredTime === 'evening' && hour >= 17 && hour <= 21) {
    preferenceFactor = 1.2;
  } else if (preferredTime === 'anytime') {
    preferenceFactor = 1.0;
  } else {
    preferenceFactor = 0.8;
  }

  return { hourFactor, dayFactor, preferenceFactor };
}

/**
 * Get location-based availability factor
 */
function getLocationFactor(maxDistance) {
  if (maxDistance >= 50) return 1.0;
  if (maxDistance >= 25) return 0.9;
  if (maxDistance >= 10) return 0.8;
  return 0.7;
}

/**
 * Get seasonal availability factor
 */
function getSeasonalFactor(month) {
  // Holiday seasons typically have lower availability
  if (month === 11 || month === 0) return 0.8; // December, January
  if (month >= 3 && month <= 5) return 1.1; // Spring
  if (month >= 6 && month <= 8) return 0.9; // Summer (vacation season)
  return 1.0; // Fall
}

/**
 * Calculate donor fatigue based on recent donation history
 */
function calculateDonorFatigue(donationHistory) {
  if (!donationHistory || donationHistory.length === 0) return 1.0;

  const recentDonations = donationHistory.filter(donation => {
    const donationDate = new Date(donation.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return donationDate > threeMonthsAgo;
  });

  // More recent donations = higher fatigue
  if (recentDonations.length >= 3) return 0.7;
  if (recentDonations.length >= 2) return 0.85;
  if (recentDonations.length >= 1) return 0.95;
  return 1.0;
}

/**
 * Get base response time based on urgency
 */
function getBaseResponseTime(urgency) {
  const baseTimes = {
    critical: 1,    // 1 hour
    high: 3,        // 3 hours
    moderate: 8,    // 8 hours
    routine: 24     // 24 hours
  };
  return baseTimes[urgency] || 8;
}

/**
 * Calculate prediction confidence based on available data
 */
function calculateConfidence(donor) {
  let confidence = 0.5;

  // More donation history = higher confidence
  if (donor.donationHistory && donor.donationHistory.length > 10) {
    confidence += 0.2;
  } else if (donor.donationHistory && donor.donationHistory.length > 5) {
    confidence += 0.1;
  }

  // Response rate data available
  if (donor.statistics.responseRate > 0) {
    confidence += 0.15;
  }

  // Recent activity
  if (donor.lastDonation) {
    const daysSinceLastDonation = (new Date() - new Date(donor.lastDonation)) / (1000 * 60 * 60 * 24);
    if (daysSinceLastDonation < 365) {
      confidence += 0.1;
    }
  }

  // Profile completeness
  if (donor.availability && donor.medicalInfo) {
    confidence += 0.05;
  }

  return Math.min(confidence, 1.0);
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(donor, availabilityScore, urgency) {
  const recommendations = [];

  if (availabilityScore < 0.3) {
    recommendations.push('Consider contacting backup donors');
    recommendations.push('Expand search radius');
  } else if (availabilityScore < 0.6) {
    recommendations.push('Contact donor with urgency details');
    recommendations.push('Provide flexible scheduling options');
  } else {
    recommendations.push('High probability donor - contact immediately');
  }

  if (urgency === 'critical') {
    recommendations.push('Use multiple communication channels (SMS + Call)');
    recommendations.push('Mention critical nature in first contact');
  }

  // Time-based recommendations
  const currentHour = new Date().getHours();
  if (currentHour < 9 || currentHour > 21) {
    recommendations.push('Consider waiting for business hours unless critical');
  }

  // Preference-based recommendations
  if (donor.availability.preferredTime !== 'anytime') {
    recommendations.push(`Best contact time: ${donor.availability.preferredTime}`);
  }

  return recommendations;
}

/**
 * Batch predict availability for multiple donors
 */
async function batchPredictAvailability(donors, urgency = 'moderate') {
  const predictions = [];
  
  for (const donor of donors) {
    const prediction = await predictDonorAvailability(donor, urgency);
    predictions.push({
      donorId: donor._id,
      ...prediction
    });
  }

  // Sort by availability score
  return predictions.sort((a, b) => b.availability - a.availability);
}

/**
 * Get optimal contact strategy for a donor
 */
function getOptimalContactStrategy(donor, urgency) {
  const prediction = predictDonorAvailability(donor, urgency);
  
  const strategy = {
    channels: ['sms'], // Start with SMS
    timing: 'immediate',
    message: 'standard',
    followUp: 4 // hours
  };

  if (urgency === 'critical') {
    strategy.channels = ['call', 'sms'];
    strategy.message = 'urgent';
    strategy.followUp = 1;
  } else if (prediction.availability > 0.7) {
    strategy.channels = ['sms', 'push'];
    strategy.timing = 'optimal';
  }

  return strategy;
}

module.exports = {
  predictDonorAvailability,
  batchPredictAvailability,
  getOptimalContactStrategy
};