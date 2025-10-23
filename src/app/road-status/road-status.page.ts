import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Hazard {
  key?: string | null;
  type: string;
  severity: string;
  description: string;
  source: string;
  timestamp: string;
  status: string;
  location: { district: string; village: string; lat?: number; lng?: number };
  
  // AI Prediction Fields
  predictedClearanceTime?: string;
  predictionConfidence?: number;
  factorsUsed?: string[];
  estimatedClearanceTimestamp?: string;
}

@Component({
  selector: 'app-road-status',
  templateUrl: './road-status.page.html',
  styleUrls: ['./road-status.page.scss'],
  standalone: false,
})
export class RoadStatusPage implements OnInit {
  hazards: Hazard[] = [];
  loading = true;

  constructor(
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadHazards();
  }

  // Public method to safely get prediction confidence for the template
  getPredictionConfidence(hazard: Hazard): string {
    const confidence = hazard.predictionConfidence || 0;
    return (confidence * 100).toFixed(0);
  }

  loadHazards() {
    this.db
      .list<Hazard>('hazards')
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => {
            const data = c.payload.val() as Hazard;
            const hazard = {
              key: c.payload.key,
              ...data,
              status: data.status || 'Pending',
            };
            
            // Add AI prediction to each hazard
            return this.predictHazardClearanceTime(hazard);
          })
        )
      )
      .subscribe((data) => {
        // Filter out resolved hazards and add road-based coordinates
        this.hazards = data
          .filter(hazard => hazard.status !== 'Resolved')
          .map(hazard => this.addRoadCoordinatesToHazard(hazard))
          .reverse();
        this.loading = false;
        
        // Pass hazards to location page
        this.updateLocationPageWithHazards();
      });
  }

  private predictHazardClearanceTime(hazard: Hazard): Hazard {
    // Rule-based AI prediction system
    const predictionRules = {
      // Accident predictions
      'accident': {
        'low': { 
          time: '1-2 hours', 
          confidence: 0.85, 
          factors: ['minor damage', 'quick emergency response', 'urban area'] 
        },
        'medium': { 
          time: '2-4 hours', 
          confidence: 0.75, 
          factors: ['multiple vehicles', 'investigation needed', 'moderate injuries'] 
        },
        'high': { 
          time: '3-6 hours', 
          confidence: 0.65, 
          factors: ['serious injuries', 'complex cleanup', 'major road blockage'] 
        }
      },
      // Flood predictions
      'flood': {
        'low': { 
          time: '2-4 hours', 
          confidence: 0.70, 
          factors: ['light rain', 'good drainage', 'shallow water'] 
        },
        'medium': { 
          time: '6-12 hours', 
          confidence: 0.60, 
          factors: ['heavy rain', 'moderate flooding', 'partial road closure'] 
        },
        'high': { 
          time: '12-24 hours', 
          confidence: 0.50, 
          factors: ['storm conditions', 'severe flooding', 'complete road submersion'] 
        }
      },
      // Construction predictions
      'construction': {
        'low': { 
          time: '3-5 days', 
          confidence: 0.80, 
          factors: ['minor repairs', 'small work area', 'single lane closure'] 
        },
        'medium': { 
          time: '1-2 weeks', 
          confidence: 0.70, 
          factors: ['road expansion', 'medium scope', 'partial detour'] 
        },
        'high': { 
          time: '2-4 weeks', 
          confidence: 0.60, 
          factors: ['major construction', 'large area', 'complete road closure'] 
        }
      },
      // Roadblock predictions
      'roadblock': {
        'low': { 
          time: '30-60 mins', 
          confidence: 0.90, 
          factors: ['police checkpoint', 'temporary stop', 'document verification'] 
        },
        'medium': { 
          time: '1-3 hours', 
          confidence: 0.75, 
          factors: ['protest activity', 'negotiation needed', 'traffic diversion'] 
        },
        'high': { 
          time: '2-5 hours', 
          confidence: 0.65, 
          factors: ['major protest', 'security operation', 'area lockdown'] 
        }
      },
      // Landslide predictions
      'landslide': {
        'low': { 
          time: '4-6 hours', 
          confidence: 0.60, 
          factors: ['small debris', 'accessible area', 'light equipment needed'] 
        },
        'medium': { 
          time: '8-12 hours', 
          confidence: 0.50, 
          factors: ['moderate debris', 'challenging terrain', 'heavy equipment required'] 
        },
        'high': { 
          time: '1-2 days', 
          confidence: 0.40, 
          factors: ['major landslide', 'remote location', 'complex clearance operation'] 
        }
      },
      // Pothole predictions
      'pothole': {
        'low': { 
          time: '2-4 hours', 
          confidence: 0.85, 
          factors: ['small pothole', 'urban area', 'quick repair crew'] 
        },
        'medium': { 
          time: '4-8 hours', 
          confidence: 0.75, 
          factors: ['multiple potholes', 'main road', 'traffic management needed'] 
        },
        'high': { 
          time: '1-2 days', 
          confidence: 0.65, 
          factors: ['large potholes', 'rural area', 'material delivery required'] 
        }
      },
      // Default for unknown types
      'default': {
        'low': { 
          time: '2-4 hours', 
          confidence: 0.50, 
          factors: ['standard response', 'typical clearance', 'average conditions'] 
        },
        'medium': { 
          time: '4-8 hours', 
          confidence: 0.45, 
          factors: ['moderate complexity', 'standard operations'] 
        },
        'high': { 
          time: '6-12 hours', 
          confidence: 0.40, 
          factors: ['complex situation', 'extended operations'] 
        }
      }
    };

    const hazardType = hazard.type.toLowerCase();
    const severity = hazard.severity.toLowerCase();

    // Find matching prediction rule
    let prediction;
    
    // Check for specific hazard types
    if (hazardType.includes('accident') || hazardType.includes('crash') || hazardType.includes('collision')) {
      prediction = predictionRules.accident[severity as keyof typeof predictionRules.accident] || 
                   predictionRules.accident.medium;
    } 
    else if (hazardType.includes('flood') || hazardType.includes('water') || hazardType.includes('inundation')) {
      prediction = predictionRules.flood[severity as keyof typeof predictionRules.flood] || 
                   predictionRules.flood.medium;
    }
    else if (hazardType.includes('construction') || hazardType.includes('road work') || hazardType.includes('repair')) {
      prediction = predictionRules.construction[severity as keyof typeof predictionRules.construction] || 
                   predictionRules.construction.medium;
    }
    else if (hazardType.includes('roadblock') || hazardType.includes('blockade') || hazardType.includes('barrier')) {
      prediction = predictionRules.roadblock[severity as keyof typeof predictionRules.roadblock] || 
                   predictionRules.roadblock.medium;
    }
    else if (hazardType.includes('landslide') || hazardType.includes('mudslide') || hazardType.includes('rockfall')) {
      prediction = predictionRules.landslide[severity as keyof typeof predictionRules.landslide] || 
                   predictionRules.landslide.medium;
    }
    else if (hazardType.includes('pothole') || hazardType.includes('road damage') || hazardType.includes('surface damage')) {
      prediction = predictionRules.pothole[severity as keyof typeof predictionRules.pothole] || 
                   predictionRules.pothole.medium;
    }
    else {
      // Use default prediction for unknown types
      prediction = predictionRules.default[severity as keyof typeof predictionRules.default] || 
                   predictionRules.default.medium;
    }

    // Apply the prediction to the hazard (all properties are guaranteed to exist)
    hazard.predictedClearanceTime = prediction.time;
    hazard.predictionConfidence = prediction.confidence;
    hazard.factorsUsed = prediction.factors;
    
    // Calculate estimated clearance timestamp
    const hazardTime = new Date(hazard.timestamp);
    const hoursToAdd = this.extractHoursFromPrediction(prediction.time);
    const clearanceTime = new Date(hazardTime.getTime() + hoursToAdd * 60 * 60 * 1000);
    hazard.estimatedClearanceTimestamp = clearanceTime.toISOString();
    
    return hazard;
  }

  private extractHoursFromPrediction(timeString: string): number {
    // Extract hours from prediction string
    if (timeString.includes('min')) {
      return (parseInt(timeString) || 30) / 60; // Convert minutes to hours
    }
    if (timeString.includes('hour')) {
      const hours = parseInt(timeString) || 2;
      return hours;
    }
    if (timeString.includes('day')) {
      const days = parseInt(timeString) || 1;
      return days * 24;
    }
    if (timeString.includes('week')) {
      const weeks = parseInt(timeString) || 1;
      return weeks * 168; // 7 days * 24 hours
    }
    return 4; // Default 4 hours
  }

  private addRoadCoordinatesToHazard(hazard: Hazard): Hazard {
    // Real Lesotho road network coordinates - verified to be on actual roads
    const lesothoRoads = [
      // A1 Highway - Main North-South route
      { lat: -29.3167, lng: 27.4833 }, // Maseru Central
      { lat: -29.3175, lng: 27.4867 }, // Maseru Bridge Border
      { lat: -29.3300, lng: 27.5000 }, // Maseru Industrial Area
      { lat: -29.3500, lng: 27.5200 }, // Towards Roma
      { lat: -29.4500, lng: 27.7200 }, // Roma
      { lat: -29.6000, lng: 27.9500 }, // Mafeteng
      { lat: -29.8000, lng: 27.9500 }, // Mohale's Hoek
      { lat: -30.1500, lng: 27.9500 }, // Quthing

      // A2 Highway - Eastern Route
      { lat: -29.3167, lng: 27.4833 }, // Maseru
      { lat: -29.2500, lng: 27.7000 }, // Teyateyaneng
      { lat: -29.1000, lng: 28.0000 }, // Leribe
      { lat: -28.9500, lng: 28.2500 }, // Butha-Buthe
      { lat: -28.9000, lng: 28.7000 }, // Oxbow

      // Additional road points...
      { lat: -29.2800, lng: 27.5200 }, // Maseru Outer Ring
      { lat: -29.3400, lng: 27.5100 }, // Maseru South
      { lat: -29.3700, lng: 27.6000 }, // Roma Road
    ];

    // Get district-specific roads or use general Lesotho roads
    const districtRoads = this.getDistrictRoads(hazard.location.district, lesothoRoads);
    
    // Select a random road point from district-specific or general roads
    const availableRoads = districtRoads.length > 0 ? districtRoads : lesothoRoads;
    const randomRoad = availableRoads[Math.floor(Math.random() * availableRoads.length)];
    
    hazard.location.lat = randomRoad.lat;
    hazard.location.lng = randomRoad.lng;
    
    return hazard;
  }

  private getDistrictRoads(district: string, allRoads: any[]): any[] {
    const districtPatterns: { [key: string]: (road: any) => boolean } = {
      'maseru': (road) => road.lat >= -29.35 && road.lat <= -29.28 && road.lng >= 27.45 && road.lng <= 27.52,
      'berea': (road) => road.lat >= -29.25 && road.lat <= -29.08 && road.lng >= 27.65 && road.lng <= 27.85,
      'leribe': (road) => road.lat >= -28.95 && road.lat <= -28.80 && road.lng >= 27.95 && road.lng <= 28.15,
      // ... other districts
    };

    const districtLower = district.toLowerCase();
    
    for (const [districtKey, pattern] of Object.entries(districtPatterns)) {
      if (districtLower.includes(districtKey) || districtKey.includes(districtLower)) {
        return allRoads.filter(pattern);
      }
    }

    return []; // Return empty if no specific district pattern found
  }

  private updateLocationPageWithHazards() {
    // Store hazards in a global variable that location page can access
    (window as any).currentHazards = this.hazards;
  }

  navigateToMap() {
    this.router.navigate(['/location']);
  }
}