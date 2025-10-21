import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

interface Hazard {
  key?: string | null;
  type: string;
  description: string;
  location: { district: string; village: string };
  severity: string;
  source: string;
  status: string;
  timestamp: string;
}

@Component({
  selector: 'app-admin-hazard',
  templateUrl: './admin-hazard.page.html',
  styleUrls: ['./admin-hazard.page.scss'],
})
export class AdminHazardPage implements OnInit {
  hazards: Hazard[] = [];
  filteredHazards: Hazard[] = [];
  loading = true;
  selectedDistrict: string = '';

  districts: string[] = [
    'Maseru',
    'Mafeteng',
    'Berea',
    'Mokhotlong',
    'Quthing',
    'Qacha\'s Nek',
    'Leribe',
    'Butha-Buthe',
    'Mohale\'s Hoek',
    'Thaba-Tseka',
    'Semonkong'
  ];

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
              status: data.status || 'Pending',
            };
          })
        )
      )
      .subscribe((data) => {
        this.hazards = data.reverse();
        this.filterByDistrict();
        this.loading = false;
      });
  }

  filterByDistrict() {
    if (!this.selectedDistrict) {
      this.filteredHazards = this.hazards;
    } else {
      this.filteredHazards = this.hazards.filter(
        (h) => h.location.district === this.selectedDistrict
      );
    }
  }

  updateStatus(hazard: Hazard) {
    if (!hazard.key) return;

    this.db
      .object(`hazards/${hazard.key}`)
      .update({ status: hazard.status })
      .then(() => {
        console.log(`Hazard ${hazard.key} status updated to ${hazard.status}`);
      })
      .catch((err) => {
        console.error('Error updating status:', err);
        alert('Failed to update status.');
      });
  }
}
