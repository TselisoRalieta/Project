import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Icon, Style, Stroke } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: false,
})
export class LocationPage implements OnInit {

  map!: Map;
  markerLayer!: VectorLayer;
  routeLayer!: VectorLayer;

  departureCoordinates: string | null = null;
  departureAddress: string | null = null;
  arrivalCoordinates: string | null = null;
  arrivalAddress: string | null = null;

  constructor() {}

  ngOnInit() {
    // Initialize map after view is loaded
    setTimeout(() => this.initializeMap(), 500);
  }

  initializeMap() {
    const markerSource = new VectorSource();
    this.markerLayer = new VectorLayer({
      source: markerSource,
    });

    // Route layer with style for main/alternative routes
    this.routeLayer = new VectorLayer({
      source: new VectorSource(),
      style: (feature) => {
        const type = feature.get('routeType');
        return new Style({
          stroke: new Stroke({
            color: type === 'main' ? 'blue' : 'green',
            width: type === 'main' ? 5 : 3,
          }),
        });
      },
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() }),
        this.routeLayer,
        this.markerLayer,
      ],
      view: new View({
        center: fromLonLat([27.4854, -29.3158]),
        zoom: 12,
      }),
    });

    // Click to select departure/arrival
    this.map.on('click', async (event: any) => {
      const coords = event.coordinate;
      const [lon, lat] = toLonLat(coords);
      const formattedCoords = `${lat.toFixed(6)},${lon.toFixed(6)}`;

      // Create marker feature
      const marker = new Feature({ geometry: new Point(coords) });
      marker.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: !this.departureCoordinates
            ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        }),
      }));
      this.markerLayer.getSource()?.addFeature(marker);

      if (!this.departureCoordinates) {
        this.departureCoordinates = formattedCoords;
        this.departureAddress = await this.fetchAddress(lat, lon);
        alert('Departure selected: ' + this.departureAddress);
      } else if (!this.arrivalCoordinates) {
        this.arrivalCoordinates = formattedCoords;
        this.arrivalAddress = await this.fetchAddress(lat, lon);
        alert('Arrival selected: ' + this.arrivalAddress);

        // Show main and alternative routes
        this.showRoute(this.departureCoordinates, this.arrivalCoordinates);
      }
    });
  }

  // Save selected locations
  saveCoordinates() {
    if (this.departureCoordinates && this.arrivalCoordinates &&
        this.departureAddress && this.arrivalAddress) {
      alert('Locations saved successfully!');
    } else {
      alert('Please select both departure and arrival locations.');
    }
  }

  // Show routes from Google Directions API
  async showRoute(departure: string, arrival: string) {
    try {
      const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with your key
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${departure}&destination=${arrival}&alternatives=true&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        this.routeLayer!.getSource()!.clear();

        data.routes.forEach((route: any, index: number) => {
          const coordinates = this.decodePolyline(route.overview_polyline.points)
            .map(([lat, lon]) => fromLonLat([lon, lat]));
          const routeFeature = new Feature({
            geometry: new LineString(coordinates),
            routeType: index === 0 ? 'main' : 'alternative',
          });
          this.routeLayer!.getSource()!.addFeature(routeFeature);
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  }

  // Decode Google polyline
  decodePolyline(encoded: string): [number, number][] {
    let points: [number, number][] = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push([lat / 1e5, lng / 1e5]);
    }

    return points;
  }

  // Dummy fetch address (replace with real API if needed)
  async fetchAddress(lat: number, lon: number): Promise<string> {
    return `Address at ${lat.toFixed(6)},${lon.toFixed(6)}`;
  }
}
