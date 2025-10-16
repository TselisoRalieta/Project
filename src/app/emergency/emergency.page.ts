import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

interface Hazard {
  type: string;
  severity: string;
  description: string;
  source: string;
  timestamp: string;
  location: { district: string; village: string };
}

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
})
export class EmergencyPage implements OnInit {
  hazards: Hazard[] = [];
  loading = true;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.list<Hazard>('hazards').snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() as Hazard })))
    ).subscribe(data => {
      this.hazards = data.reverse();
      this.loading = false;
    });
  }
}
