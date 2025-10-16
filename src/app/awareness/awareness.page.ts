import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface Hazard {
  type: string;
  description: string;
  location: { district: string; village: string };
  severity: string;
  source: string;
  timestamp?: string;
}

@Component({
  selector: 'app-awareness',
  templateUrl: './awareness.page.html',
  styleUrls: ['./awareness.page.scss'],
})
export class AwarenessPage {
  hazard: Hazard = {
    type: 'other',
    description: '',
    location: { district: '', village: '' },
    severity: 'low',
    source: 'crowd',
  };

  constructor(private db: AngularFireDatabase) {}

  submitReport() {
    if (!this.hazard.type || !this.hazard.description?.trim() || 
        !this.hazard.location.district?.trim() || !this.hazard.location.village?.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    this.hazard.timestamp = new Date().toISOString();

    // Push hazard to Firebase
    this.db.list('hazards').push(this.hazard)
      .then(() => {
        // Automatically push a notification
        this.db.list('notifications').push({
          title: `New Hazard: ${this.hazard.type}`,
          description: this.hazard.description,
          timestamp: this.hazard.timestamp
        });

        alert('Hazard submitted successfully!');
        // Reset form
        this.hazard = {
          type: 'other',
          description: '',
          location: { district: '', village: '' },
          severity: 'low',
          source: 'crowd',
        };
      })
      .catch(err => alert('Error: ' + err));
  }
}
