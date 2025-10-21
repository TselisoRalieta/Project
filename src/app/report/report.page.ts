import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface Hazard {
  type: string;
  description: string;
  location: { district: string; village: string };
  severity: string;
  source: string;
  status: string;
  timestamp?: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage {
  hazard: Hazard = {
    type: 'other',
    description: '',
    location: { district: '', village: '' },
    severity: 'low',
    source: 'crowd',
    status: 'Pending',
  };

  districts: string[] = [
    'Maseru',
    'Mafeteng',
    'Berea',
    'Mokhotlong',
    'Quthing',
    'Semonkong',
    'Qacha\'s Nek',
    'Leribe',
    'Butha-Buthe',
    'Mohale\'s Hoek',
    'Thaba-Tseka',
    'Semonkong' // Added Semonkong
  ];

  constructor(private db: AngularFireDatabase) {}

  submitReport() {
    if (
      !this.hazard.type ||
      !this.hazard.description?.trim() ||
      !this.hazard.location.district?.trim() ||
      !this.hazard.location.village?.trim()
    ) {
      alert('Please fill in all fields.');
      return;
    }

    this.hazard.timestamp = new Date().toISOString();

    this.db.list('hazards')
      .push(this.hazard)
      .then(() => {
        this.db.list('notifications').push({
          title: `New Hazard: ${this.hazard.type}`,
          description: this.hazard.description,
          timestamp: this.hazard.timestamp,
        });

        alert('Hazard submitted successfully!');

        // Reset the form
        this.hazard = {
          type: 'other',
          description: '',
          location: { district: '', village: '' },
          severity: 'low',
          source: 'crowd',
          status: 'Pending',
        };
      })
      .catch((err) => alert('Error: ' + err));
  }
}
