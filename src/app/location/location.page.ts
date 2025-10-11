import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  departureAddress: string = '';
  arrivalAddress: string = '';
  routeLayer: VectorLayer<VectorSource> | null = null;

  constructor(private toastCtrl: ToastController) {}

  ngOnInit() {
    // Initialize routeLayer
    this.routeLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: '#3e3e3e',
          width: 4
        })
      })
    });

    // Initialize map here and add routeLayer to map
    // Example: this.map.addLayer(this.routeLayer);
  }

  async fetchAddress(lat: number, lon: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      return data.display_name || `Lat: ${lat}, Lon: ${lon}`;
    } catch {
      return `Address at ${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color: 'dark'
    });
    toast.present();
  }

  async saveCoordinates() {
    if (this.departureAddress && this.arrivalAddress) {
      this.showToast('Locations saved successfully!');
    } else {
      this.showToast('Please select both departure and arrival points.');
    }
  }

  async showRoute(departure: string, arrival: string) {
    try {
      const apiKey = 'YOUR_ORS_API_KEY'; // Replace with your ORS key
      const [depLat, depLon] = departure.split(',').map(Number);
      const [arrLat, arrLon] = arrival.split(',').map(Number);

      const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

      const body = {
        coordinates: [[depLon, depLat], [arrLon, arrLat]],
        alternative_routes: {
          target_count: 3,
          share_factor: 0.6,
          weight_factor: 1.4
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': apiKey
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        this.routeLayer!.getSource()!.clear();

        data.features.forEach((feature: any, index: number) => {
          const coords = feature.geometry.coordinates.map(
            ([lon, lat]: [number, number]) => fromLonLat([lon, lat])
          );

          const routeFeature = new Feature({
            geometry: new LineString(coords),
            routeType: index === 0 ? 'main' : 'alternative',
          });

          // Set style: main route = dark gray, alternative = coral
          routeFeature.setStyle(
            new Style({
              stroke: new Stroke({
                color: index === 0 ? '#3e3e3e' : '#ff7f50',
                width: 4
              })
            })
          );

          this.routeLayer!.getSource()!.addFeature(routeFeature);
        });

        this.showToast('Routes displayed successfully.');
      } else {
        this.showToast('No routes found.');
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      this.showToast('Failed to fetch route. Check API key.');
    }
  }

  // Example method to select departure/arrival (replace with actual logic)
  async selectPoint(lat: number, lon: number, type: 'departure' | 'arrival') {
    const address = await this.fetchAddress(lat, lon);
    if (type === 'departure') {
      this.departureAddress = address;
      this.showToast('Departure selected: ' + this.departureAddress);
    } else {
      this.arrivalAddress = address;
      this.showToast('Arrival selected: ' + this.arrivalAddress);
    }
  }
}
