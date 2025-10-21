import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

interface Hazard {
  key?: string | null;
  type: string;
  severity: string;
  description: string;
  source: string;
  timestamp: string;
  status: string;
  location: { district: string; village: string };
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

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db
      .list<Hazard>('hazards')
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => {
            const data = c.payload.val() as Hazard;
            return {
              key: c.payload.key,
              ...data,
              status: data.status || 'Pending', // Default to Pending
            };
          })
        )
      )
      .subscribe((data) => {
        this.hazards = data.reverse(); // newest first
        this.loading = false;
      });
  }
}
