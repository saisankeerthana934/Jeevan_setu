// Blood type compatibility utilities

const bloodTypeCompatibilityMap = {
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-']
  },
  'A-': {
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-']
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-']
  },
  'B-': {
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-']
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] // Universal recipient
  },
  'AB-': {
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['A-', 'B-', 'AB-', 'O-']
  },
  'O+': {
    canDonateTo: ['A+', 'B+', 'AB+', 'O+'],
    canReceiveFrom: ['O+', 'O-']
  },
  'O-': {
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal donor
    canReceiveFrom: ['O-']
  }
};

/**
 * Check if a donor can donate blood to a recipient
 * @param {string} donorType - Donor's blood type
 * @param {string} recipientType - Recipient's blood type
 * @returns {boolean} - True if compatible
 */
function canDonateBlood(donorType, recipientType) {
  const compatibility = bloodTypeCompatibilityMap[donorType];
  return compatibility ? compatibility.canDonateTo.includes(recipientType) : false;
}

/**
 * Check if a recipient can receive blood from a donor
 * @param {string} recipientType - Recipient's blood type
 * @param {string} donorType - Donor's blood type
 * @returns {boolean} - True if compatible
 */
function canReceiveBlood(recipientType, donorType) {
  const compatibility = bloodTypeCompatibilityMap[recipientType];
  return compatibility ? compatibility.canReceiveFrom.includes(donorType) : false;
}

/**
 * Get all compatible donor blood types for a recipient
 * @param {string} recipientType - Recipient's blood type
 * @returns {string[]} - Array of compatible donor blood types
 */
function getCompatibleDonors(recipientType) {
  const compatibility = bloodTypeCompatibilityMap[recipientType];
  return compatibility ? compatibility.canReceiveFrom : [];
}

/**
 * Get all compatible recipient blood types for a donor
 * @param {string} donorType - Donor's blood type
 * @returns {string[]} - Array of compatible recipient blood types
 */
function getCompatibleRecipients(donorType) {
  const compatibility = bloodTypeCompatibilityMap[donorType];
  return compatibility ? compatibility.canDonateTo : [];
}

/**
 * Check if blood type is universal donor (O-)
 * @param {string} bloodType - Blood type to check
 * @returns {boolean} - True if universal donor
 */
function isUniversalDonor(bloodType) {
  return bloodType === 'O-';
}

/**
 * Check if blood type is universal recipient (AB+)
 * @param {string} bloodType - Blood type to check
 * @returns {boolean} - True if universal recipient
 */
function isUniversalRecipient(bloodType) {
  return bloodType === 'AB+';
}

/**
 * Get detailed blood type compatibility information
 * @param {string} bloodType - Blood type to analyze
 * @returns {object} - Detailed compatibility information
 */
function getBloodTypeInfo(bloodType) {
  const compatibility = bloodTypeCompatibilityMap[bloodType];
  if (!compatibility) return null;

  return {
    bloodType,
    canDonateTo: compatibility.canDonateTo,
    canReceiveFrom: compatibility.canReceiveFrom,
    isUniversalDonor: isUniversalDonor(bloodType),
    isUniversalRecipient: isUniversalRecipient(bloodType),
    donorCompatibilityCount: compatibility.canDonateTo.length,
    recipientCompatibilityCount: compatibility.canReceiveFrom.length
  };
}

/**
 * Calculate match score between donor and recipient
 * @param {string} donorType - Donor's blood type
 * @param {string} recipientType - Recipient's blood type
 * @param {number} distance - Distance between donor and recipient in km
 * @returns {number} - Match score between 0 and 1
 */
function calculateMatchScore(donorType, recipientType, distance = 0) {
  // Check basic compatibility
  if (!canDonateBlood(donorType, recipientType)) {
    return 0;
  }

  let score = 1;

  // Exact match bonus
  if (donorType === recipientType) {
    score *= 1.2;
  }

  // Distance penalty (assuming distance in km)
  if (distance > 0) {
    const distanceFactor = Math.max(0.1, 1 - (distance / 100)); // Penalty after 100km
    score *= distanceFactor;
  }

  // Universal donor bonus for rare blood types
  if (isUniversalDonor(donorType)) {
    score *= 1.1;
  }

  return Math.min(score, 1);
}

/**
 * Get blood type rarity score (lower score = more rare)
 * @param {string} bloodType - Blood type to check
 * @returns {number} - Rarity score
 */
function getBloodTypeRarity(bloodType) {
  const rarityScores = {
    'O+': 0.374,  // Most common
    'A+': 0.357,
    'B+': 0.085,
    'O-': 0.066,
    'A-': 0.063,
    'AB+': 0.034,
    'B-': 0.015,
    'AB-': 0.006  // Most rare
  };

  return rarityScores[bloodType] || 0.5;
}

module.exports = {
  canDonateBlood,
  canReceiveBlood,
  getCompatibleDonors,
  getCompatibleRecipients,
  isUniversalDonor,
  isUniversalRecipient,
  getBloodTypeInfo,
  calculateMatchScore,
  getBloodTypeRarity,
  bloodTypeCompatibilityMap
};