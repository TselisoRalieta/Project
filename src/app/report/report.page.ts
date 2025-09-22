import { Component } from '@angular/core';
import { HazardService } from '../services/hazard.service';
import { Hazard } from '../models/hazard';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: false,
})
export class ReportPage {
  hazard: Hazard = {
    type: 'other',
    description: '',
    location: { district: '', village: '' },
    severity: 'low',
    source: 'crowd'
  };

  constructor(private hazardService: HazardService) {}

  submitReport() {
    // Basic validation: check all required fields
    if (!this.hazard.type) {
      alert('Please select a hazard type.');
      return;
    }
    if (!this.hazard.description?.trim()) {
      alert('Please enter a description.');
      return;
    }
    if (!this.hazard.location.district?.trim()) {
      alert('Please enter a district.');
      return;
    }
    if (!this.hazard.location.village?.trim()) {
      alert('Please enter a village.');
      return;
    }
    if (!this.hazard.severity) {
      alert('Please select a severity level.');
      return;
    }

    // All fields valid, submit
    this.hazard.timestamp = new Date().toISOString();
    this.hazardService.reportHazard(this.hazard).subscribe({
      next: () => alert('Hazard reported successfully!'),
      error: (err) => alert('Error reporting hazard: ' + err)
    });
  }
}
