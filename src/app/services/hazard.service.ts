import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer, switchMap } from 'rxjs';
import { Hazard } from '../models/hazard';

@Injectable({
  providedIn: 'root'
})
export class HazardService {
  private apiUrl = 'http://localhost:3000'; // Change to your backend

  constructor(private http: HttpClient) {}

  // Poll hazards every 60s
  getHazards(): Observable<Hazard[]> {
    return timer(0, 60000).pipe(
      switchMap(() => this.http.get<Hazard[]>(`${this.apiUrl}/hazards`))
    );
  }

  // Report a new hazard
  reportHazard(hazard: Hazard): Observable<Hazard> {
    return this.http.post<Hazard>(`${this.apiUrl}/report`, hazard);
  }
}
