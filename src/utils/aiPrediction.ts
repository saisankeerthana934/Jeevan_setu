// AI-powered donor availability prediction using historical patterns
interface DonorPattern {
  bloodType: string;
  location: string;
  dayOfWeek: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  seasonality: 'winter' | 'spring' | 'summer' | 'monsoon';
  responseRate: number;
  lastDonationDays: number;
}

interface PredictionResult {
  availability: number; // 0-1 probability
  estimatedResponseTime: number; // in hours
  recommendedContactTime: string;
  confidence: number;
}

class DonorAvailabilityPredictor {
  private historicalData: DonorPattern[] = [
    // Mock historical data for demonstration
    { bloodType: 'O+', location: 'Delhi', dayOfWeek: 1, timeOfDay: 'morning', seasonality: 'winter', responseRate: 0.85, lastDonationDays: 90 },
    { bloodType: 'B+', location: 'Mumbai', dayOfWeek: 3, timeOfDay: 'afternoon', seasonality: 'summer', responseRate: 0.72, lastDonationDays: 60 },
    { bloodType: 'A+', location: 'Bangalore', dayOfWeek: 5, timeOfDay: 'evening', seasonality: 'monsoon', responseRate: 0.68, lastDonationDays: 120 },
    // Add more mock data...
  ];

  private getSeasonality(): 'winter' | 'spring' | 'summer' | 'monsoon' {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 8) return 'summer';
    if (month >= 9 && month <= 10) return 'monsoon';
    return 'winter';
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  private calculateWeightedScore(patterns: DonorPattern[]): number {
    if (patterns.length === 0) return 0.5; // Default probability

    const weights = {
      bloodType: 0.3,
      location: 0.25,
      dayOfWeek: 0.15,
      timeOfDay: 0.1,
      seasonality: 0.1,
      lastDonationDays: 0.1
    };

    const averageResponseRate = patterns.reduce((sum, pattern) => sum + pattern.responseRate, 0) / patterns.length;
    
    // Adjust for donation frequency (donors who donated recently are less likely to be available)
    const avgLastDonation = patterns.reduce((sum, pattern) => sum + pattern.lastDonationDays, 0) / patterns.length;
    const donationFrequencyFactor = Math.min(avgLastDonation / 90, 1); // 90 days is ideal gap

    return Math.min(averageResponseRate * donationFrequencyFactor, 1);
  }

  public predictAvailability(
    bloodType: string,
    location: string,
    urgency: 'critical' | 'high' | 'moderate' | 'routine'
  ): PredictionResult {
    const currentDay = new Date().getDay();
    const currentTimeOfDay = this.getTimeOfDay();
    const currentSeason = this.getSeasonality();

    // Filter historical data for similar conditions
    const relevantPatterns = this.historicalData.filter(pattern => {
      let score = 0;
      if (pattern.bloodType === bloodType) score += 3;
      if (pattern.location === location) score += 2;
      if (pattern.dayOfWeek === currentDay) score += 1;
      if (pattern.timeOfDay === currentTimeOfDay) score += 1;
      if (pattern.seasonality === currentSeason) score += 1;
      return score >= 2; // Minimum relevance threshold
    });

    const baseAvailability = this.calculateWeightedScore(relevantPatterns);

    // Adjust for urgency (critical requests get priority boost in notifications)
    const urgencyMultiplier = {
      critical: 1.2,
      high: 1.1,
      moderate: 1.0,
      routine: 0.9
    };

    const adjustedAvailability = Math.min(baseAvailability * urgencyMultiplier[urgency], 1);

    // Estimate response time based on availability and urgency
    const baseResponseTime = {
      critical: 2,
      high: 6,
      moderate: 12,
      routine: 24
    };

    const estimatedResponseTime = baseResponseTime[urgency] / adjustedAvailability;

    // Recommend best contact time
    const recommendedContactTime = this.getRecommendedContactTime(urgency);

    // Calculate confidence based on data quality
    const confidence = Math.min(relevantPatterns.length / 10, 1);

    return {
      availability: adjustedAvailability,
      estimatedResponseTime,
      recommendedContactTime,
      confidence
    };
  }

  private getRecommendedContactTime(urgency: string): string {
    const now = new Date();
    const hour = now.getHours();

    if (urgency === 'critical') {
      return 'Immediately - Contact all available donors';
    }

    if (hour < 9) {
      return 'Best time: 9:00 AM - 11:00 AM';
    } else if (hour < 14) {
      return 'Best time: 2:00 PM - 5:00 PM';
    } else {
      return 'Best time: Tomorrow 9:00 AM - 11:00 AM';
    }
  }

  public getCompatibleBloodTypes(requestedType: string): string[] {
    const compatibility: { [key: string]: string[] } = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'] // Universal donor
    };

    return compatibility[requestedType] || [requestedType];
  }

  public calculateMatchScore(donorBloodType: string, requestedType: string, distance: number): number {
    const compatibleTypes = this.getCompatibleBloodTypes(requestedType);
    
    if (!compatibleTypes.includes(donorBloodType)) {
      return 0; // Not compatible
    }

    let score = 1;

    // Exact match gets bonus
    if (donorBloodType === requestedType) {
      score *= 1.2;
    }

    // Distance penalty (assuming distance in km)
    const distanceFactor = Math.max(0.1, 1 - (distance / 50)); // Penalty after 50km
    score *= distanceFactor;

    return Math.min(score, 1);
  }
}

export const donorPredictor = new DonorAvailabilityPredictor();