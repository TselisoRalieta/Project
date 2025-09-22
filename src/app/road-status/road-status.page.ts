import { Component, OnInit } from '@angular/core';
import { HazardService } from '../services/hazard.service';
import { Hazard } from '../models/hazard';

@Component({
  selector: 'app-road-status',
  templateUrl: './road-status.page.html',
  styleUrls: ['./road-status.page.scss'],
  standalone: false,
})
export class RoadStatusPage implements OnInit {
  hazards: Hazard[] = [];
  loading = true;

  constructor(private hazardService: HazardService) {}

  ngOnInit() {
    this.hazardService.getHazards().subscribe({
      next: (data) => {
        this.hazards = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching hazards', err);
        this.loading = false;
      }
    });
  }
}
