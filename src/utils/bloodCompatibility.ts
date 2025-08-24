// Blood type compatibility checker and matching utilities

export interface BloodTypeCompatibility {
  canDonateTo: string[];
  canReceiveFrom: string[];
}

export const bloodTypeCompatibilityMap: { [key: string]: BloodTypeCompatibility } = {
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

export function canDonateBlood(donorType: string, recipientType: string): boolean {
  const compatibility = bloodTypeCompatibilityMap[donorType];
  return compatibility ? compatibility.canDonateTo.includes(recipientType) : false;
}

export function canReceiveBlood(recipientType: string, donorType: string): boolean {
  const compatibility = bloodTypeCompatibilityMap[recipientType];
  return compatibility ? compatibility.canReceiveFrom.includes(donorType) : false;
}

export function getCompatibleDonors(recipientType: string): string[] {
  const compatibility = bloodTypeCompatibilityMap[recipientType];
  return compatibility ? compatibility.canReceiveFrom : [];
}

export function getCompatibleRecipients(donorType: string): string[] {
  const compatibility = bloodTypeCompatibilityMap[donorType];
  return compatibility ? compatibility.canDonateTo : [];
}

export function isUniversalDonor(bloodType: string): boolean {
  return bloodType === 'O-';
}

export function isUniversalRecipient(bloodType: string): boolean {
  return bloodType === 'AB+';
}

export function getBloodTypeInfo(bloodType: string) {
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