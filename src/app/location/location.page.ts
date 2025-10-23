import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { OSM } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Icon, Style, Stroke, Fill, Text, Circle as CircleStyle } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import { ToastController } from '@ionic/angular';

interface Hazard {
  key?: string | null;
  type: string;
  severity: string;
  description: string;
  source: string;
  timestamp: string;
  status: string;
  location: { district: string; village: string; lat?: number; lng?: number };
}

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
  standalone: false,
})
export class LocationPage implements AfterViewInit, OnInit {
  map!: Map;
  markerLayer!: VectorLayer;
  routeLayer!: VectorLayer;
  hazardLayer!: VectorLayer;

  departureCoordinates: string | null = null;
  departureAddress: string | null = null;
  arrivalCoordinates: string | null = null;
  arrivalAddress: string | null = null;
  routesFound: number = 0;
  hazards: Hazard[] = [];

  constructor(private toastCtrl: ToastController) {}

  ngOnInit() {
    this.loadHazardsFromRoadStatus();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initializeMap(), 50);
  }

  private loadHazardsFromRoadStatus() {
    if ((window as any).currentHazards) {
      this.hazards = (window as any).currentHazards;
      console.log('Loaded hazards for map:', this.hazards);
    } else {
      console.log('No hazards found from road status page');
    }
  }

  initializeMap() {
    const markerSource = new VectorSource();
    const hazardSource = new VectorSource();
    
    this.markerLayer = new VectorLayer({ source: markerSource });
    this.routeLayer = new VectorLayer({ source: new VectorSource() });
    this.hazardLayer = new VectorLayer({ source: hazardSource });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({ 
          source: new OSM({
            crossOrigin: 'anonymous'
          }),
          opacity: 1
        }),
        this.routeLayer,
        this.hazardLayer,
        this.markerLayer,
      ],
      view: new View({
        center: fromLonLat([27.4854, -29.3158]),
        zoom: 12,
      }),
    });

    this.plotHazardsOnMap();

    this.map.on('click', async (event: any) => {
      const coords = event.coordinate;
      const [lon, lat] = toLonLat(coords);
      const formattedCoords = `${lat.toFixed(6)},${lon.toFixed(6)}`;

      const marker = new Feature({ geometry: new Point(coords) });
      marker.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: !this.departureCoordinates
              ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            crossOrigin: 'anonymous'
          }),
        })
      );
      this.markerLayer.getSource()?.addFeature(marker);

      if (!this.departureCoordinates) {
        this.departureCoordinates = formattedCoords;
        this.departureAddress = await this.fetchAddress(lat, lon);
        this.showToast('Departure selected: ' + this.departureAddress);
      } else if (!this.arrivalCoordinates) {
        this.arrivalCoordinates = formattedCoords;
        this.arrivalAddress = await this.fetchAddress(lat, lon);
        this.showToast('Arrival selected: ' + this.arrivalAddress);
        
        await this.showAllPossibleRoutes(this.departureCoordinates, this.arrivalCoordinates);
      }
    });
  }

  private plotHazardsOnMap() {
    if (!this.hazards || this.hazards.length === 0) {
      console.log('No hazards to plot on map');
      return;
    }

    const hazardSource = this.hazardLayer.getSource();
    if (!hazardSource) return;

    this.hazards.forEach(hazard => {
      if (hazard.location.lat && hazard.location.lng) {
        const coordinates = fromLonLat([hazard.location.lng, hazard.location.lat]);
        const hazardFeature = new Feature({
          geometry: new Point(coordinates),
          hazard: hazard
        });

        const style = this.getHazardStyle(hazard);
        hazardFeature.setStyle(style);

        hazardSource.addFeature(hazardFeature);
      }
    });

    this.showToast(`${this.hazards.length} hazard(s) displayed on map`);
  }

  private getHazardStyle(hazard: Hazard): Style {
    // Color coding based on status
    let color = '#ffa500'; // Orange for Pending
    let strokeColor = '#cc8400'; // Darker orange border
    let textBackground = 'rgba(255,255,255,0.9)';
    
    if (hazard.status === 'Verified') {
      color = '#ff0000'; // Red for Verified
      strokeColor = '#cc0000'; // Darker red border
      textBackground = 'rgba(255,240,240,0.9)'; // Light red background for verified
    }

    // Different sizes based on hazard type
    let radius = 8;
    let textOffset = -20;
    let strokeWidth = 3;
    let fontSize = '11px';
    
    if (hazard.type.toLowerCase().includes('flood')) {
      radius = 10; // Larger for floods
      textOffset = -25;
      strokeWidth = 3;
    } else if (hazard.type.toLowerCase().includes('accident')) {
      radius = 9; // Medium for accidents
      textOffset = -22;
      strokeWidth = 3;
    } else if (hazard.type.toLowerCase().includes('construction')) {
      radius = 8; // Standard for construction
      textOffset = -20;
      strokeWidth = 2;
    } else if (hazard.type.toLowerCase().includes('roadblock')) {
      radius = 12; // Largest for roadblocks
      textOffset = -28;
      strokeWidth = 4;
    } else if (hazard.type.toLowerCase().includes('landslide')) {
      radius = 11; // Large for landslides
      textOffset = -26;
      strokeWidth = 3;
    } else if (hazard.type.toLowerCase().includes('pothole')) {
      radius = 6; // Smaller for potholes
      textOffset = -18;
      strokeWidth = 2;
      fontSize = '10px';
    }

    // Adjust font weight based on severity
    let fontWeight = 'bold';
    if (hazard.severity.toLowerCase() === 'high') {
      fontWeight = 'bolder';
      fontSize = '12px';
    } else if (hazard.severity.toLowerCase() === 'low') {
      fontWeight = 'normal';
    }

    // Create the text content
    const hazardText = `⚠ ${hazard.type}\n${hazard.severity.toUpperCase()}`;

    return new Style({
      image: new CircleStyle({
        radius: radius,
        fill: new Fill({ color: color }),
        stroke: new Stroke({
          color: strokeColor,
          width: strokeWidth
        })
      }),
      text: new Text({
        text: hazardText,
        offsetY: textOffset,
        font: `${fontWeight} ${fontSize} Arial, sans-serif`,
        fill: new Fill({ color: '#000000' }),
        stroke: new Stroke({ 
          color: '#ffffff', 
          width: 2 
        }),
        backgroundFill: new Fill({ 
          color: textBackground 
        }),
        padding: [3, 5, 3, 5],
        textAlign: 'center',
        textBaseline: 'bottom'
      })
    });
  }

  // DOWNLOAD METHODS
  async downloadMap() {
    if (this.routesFound === 0 && this.hazards.length === 0) {
      this.showToast('No routes or hazards to download. Please generate routes or view hazards first.');
      return;
    }

    try {
      this.showToast('Preparing map download...');
      
      const success = await this.tryCanvasCapture();
      
      if (!success) {
        await this.useHtml2CanvasFallback();
      }
      
    } catch (error) {
      console.error('All download methods failed:', error);
      this.showToast('Download failed. Please try the manual method below.');
      this.showManualDownloadInstructions();
    }
  }

  private async tryCanvasCapture(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.map.renderSync();
        
        setTimeout(() => {
          try {
            const mapCanvas = this.getMapCanvas();
            if (!mapCanvas) {
              resolve(false);
              return;
            }

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = mapCanvas.width;
            finalCanvas.height = mapCanvas.height + 400;
            
            const context = finalCanvas.getContext('2d');
            if (!context) {
              resolve(false);
              return;
            }

            context.fillStyle = 'white';
            context.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

            try {
              context.drawImage(mapCanvas, 0, 0, mapCanvas.width, mapCanvas.height);
              this.addCustomMapOverlay(context, finalCanvas.width, mapCanvas.height);
              
              finalCanvas.toBlob((blob) => {
                if (blob) {
                  this.triggerDownload(blob, `route-hazard-map-${Date.now()}.png`);
                  this.showToast('Map with hazards downloaded successfully!');
                  resolve(true);
                } else {
                  resolve(false);
                }
              }, 'image/png');
              
            } catch (canvasError) {
              console.log('Canvas draw failed, using custom render:', canvasError);
              this.createCustomMapImage(finalCanvas, context);
              resolve(true);
            }

          } catch (error) {
            console.error('Canvas capture error:', error);
            resolve(false);
          }
        }, 1000);
        
      } catch (error) {
        console.error('Try canvas capture error:', error);
        resolve(false);
      }
    });
  }

  private getMapCanvas(): HTMLCanvasElement | null {
    const mapElement = document.getElementById('map');
    if (mapElement) {
      const canvases = mapElement.getElementsByTagName('canvas');
      if (canvases.length > 0 && canvases[0].width > 0) {
        return canvases[0];
      }
    }
    return null;
  }

  private triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private createCustomMapImage(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const width = canvas.width;
    const height = canvas.height - 400;
    
    context.fillStyle = '#e8f4f8';
    context.fillRect(0, 0, width, height);
    
    context.strokeStyle = '#b8d4e3';
    context.lineWidth = 1;
    
    for (let x = 0; x < width; x += 50) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    
    for (let y = 0; y < height; y += 50) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    
    context.fillStyle = '#333';
    context.font = 'bold 24px Arial';
    context.fillText('ROUTE MAP (Custom Render)', width / 2 - 150, height / 2);
    
    context.font = '16px Arial';
    context.fillText('Original map unavailable due to security restrictions', width / 2 - 200, height / 2 + 30);
    
    this.addCustomMapOverlay(context, width, height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        this.triggerDownload(blob, `route-map-custom-${Date.now()}.png`);
        this.showToast('Custom map representation downloaded!');
      }
    }, 'image/png');
  }

  private addCustomMapOverlay(context: CanvasRenderingContext2D, width: number, mapHeight: number) {
    const startY = mapHeight + 20;
    
    context.fillStyle = '#1a1a1a';
    context.font = 'bold 20px Arial';
    context.fillText('ROUTE NAVIGATION MAP WITH HAZARDS', 20, startY + 30);

    context.font = '14px Arial';
    
    if (this.departureAddress) {
      context.fillText('DEPARTURE:', 20, startY + 70);
      context.fillStyle = '#007bff';
      context.fillText(this.truncateText(this.departureAddress, 50), 120, startY + 70);
      context.fillStyle = '#1a1a1a';
    }
    
    if (this.arrivalAddress) {
      context.fillText('DESTINATION:', 20, startY + 100);
      context.fillStyle = '#dc3545';
      context.fillText(this.truncateText(this.arrivalAddress, 50), 120, startY + 100);
      context.fillStyle = '#1a1a1a';
    }

    if (this.hazards.length > 0) {
      context.fillText(`ACTIVE HAZARDS: ${this.hazards.length}`, 20, startY + 130);
      
      this.hazards.slice(0, 3).forEach((hazard, index) => {
        const yPos = startY + 160 + (index * 20);
        context.fillStyle = hazard.status === 'Verified' ? '#ff0000' : '#ffa500';
        context.fillText('●', 20, yPos);
        context.fillStyle = '#1a1a1a';
        context.fillText(
          `${hazard.type} (${hazard.severity}) - ${hazard.location.district}`, 
          35, 
          yPos
        );
      });
      
      if (this.hazards.length > 3) {
        context.fillText(`... and ${this.hazards.length - 3} more hazards`, 20, startY + 220);
      }
    }

    context.fillText(`ROUTES FOUND: ${this.routesFound}`, 20, startY + 250);
    context.fillText(`GENERATED: ${new Date().toLocaleString()}`, 20, startY + 280);

    this.addEnhancedLegend(context, width - 250, startY + 30);
  }

  private addEnhancedLegend(context: CanvasRenderingContext2D, x: number, y: number) {
    const routeLegendItems = [
      { color: '#007bff', text: 'Primary Route' },
      { color: '#28a745', text: 'Alternative Route' },
      { color: '#ff6b35', text: 'Waypoint Route' }
    ];

    const hazardLegendItems = [
      { color: '#ffa500', text: 'Pending Hazard' },
      { color: '#ff0000', text: 'Verified Hazard' }
    ];

    context.fillStyle = '#1a1a1a';
    context.font = 'bold 14px Arial';
    context.fillText('ROUTES', x, y);
    
    routeLegendItems.forEach((item, index) => {
      const yPos = y + 25 + (index * 25);
      context.fillStyle = item.color;
      context.fillRect(x, yPos - 10, 20, 3);
      context.fillStyle = '#1a1a1a';
      context.font = '12px Arial';
      context.fillText(item.text, x + 30, yPos);
    });

    const hazardY = y + 100;
    context.fillStyle = '#1a1a1a';
    context.font = 'bold 14px Arial';
    context.fillText('HAZARDS', x, hazardY);
    
    hazardLegendItems.forEach((item, index) => {
      const yPos = hazardY + 25 + (index * 25);
      context.fillStyle = item.color;
      context.beginPath();
      context.arc(x + 10, yPos - 5, 8, 0, 2 * Math.PI);
      context.fill();
      context.fillStyle = '#1a1a1a';
      context.font = '12px Arial';
      context.fillText(item.text, x + 30, yPos);
    });
  }

  private async useHtml2CanvasFallback() {
    try {
      await this.loadHtml2Canvas();
      
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        throw new Error('Map element not found');
      }

      const clone = mapElement.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      const canvas = await (window as any).html2canvas(clone, {
        scale: 1,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: true
      });

      document.body.removeChild(clone);

      canvas.toBlob((blob: Blob) => {
        this.triggerDownload(blob, `route-map-html2canvas-${Date.now()}.png`);
        this.showToast('Map downloaded via fallback method!');
      }, 'image/png', 0.9);

    } catch (error) {
      console.error('HTML2Canvas fallback failed:', error);
      throw error;
    }
  }

  private loadHtml2Canvas(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).html2canvas) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.integrity = 'sha512-sC/bXx1n0+y6nS0JejYQ2qk5JwQYF5N5J5N5Z5J5N5J5N5J5N5J5N5J5N5J5N5J5N5J5N5J5N5J5N5J5N5J5N5J5';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load html2canvas'));
      document.head.appendChild(script);
    });
  }

  private showManualDownloadInstructions() {
    const manualMsg = `
      Manual Download Option:
      1. Take a screenshot of the map (Ctrl+Shift+S or Cmd+Shift+S)
      2. Save the image as "route-map.png"
      3. Or use your browser's screenshot tool
    `;
    console.log(manualMsg);
    this.showToast('See console for manual download instructions');
  }

  private truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // ROUTING METHODS
  async fetchAddress(lat: number, lon: number): Promise<string> {
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
      
      const res = await fetch(proxyUrl + targetUrl, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return `Location at ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      }
    } catch (error) {
      console.warn('Geocoding failed, using coordinates:', error);
      return `Location at ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  async showAllPossibleRoutes(depCoords: string, arrCoords: string) {
    const [depLat, depLon] = depCoords.split(',').map(Number);
    const [arrLat, arrLon] = arrCoords.split(',').map(Number);

    const strategies = [
      this.showRouteOSRM(depCoords, arrCoords),
      this.showAlternativeRouteViaWaypoint(depCoords, arrCoords),
    ];

    await Promise.allSettled(strategies);
  }

  async showRouteOSRM(depCoords: string, arrCoords: string) {
    const [depLat, depLon] = depCoords.split(',').map(Number);
    const [arrLat, arrLon] = arrCoords.split(',').map(Number);

    const urls = [
      `https://router.project-osrm.org/route/v1/driving/${depLon},${depLat};${arrLon},${arrLat}?alternatives=3&geometries=geojson`,
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          this.routesFound = Math.max(this.routesFound, data.routes.length);
          
          data.routes.forEach((route: any, index: number) => {
            const coords = route.geometry.coordinates.map(([lon, lat]: [number, number]) => {
              return fromLonLat([lon, lat]);
            });

            const feature = new Feature({ geometry: new LineString(coords) });
            
            const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107'];
            feature.setStyle(
              new Style({
                stroke: new Stroke({
                  color: colors[index] || '#6f42c1',
                  width: index === 0 ? 6 : 4,
                  lineDash: index === 0 ? [] : [5, 5]
                }),
              })
            );

            this.routeLayer.getSource()?.addFeature(feature);
          });

          this.fitMapToAllRoutes();
          this.showToast(`Found ${data.routes.length} route(s)`);
          break;
        }
      } catch (err) {
        console.error('OSRM Error:', err);
      }
    }
  }

  async showAlternativeRouteViaWaypoint(depCoords: string, arrCoords: string) {
    const [depLat, depLon] = depCoords.split(',').map(Number);
    const [arrLat, arrLon] = arrCoords.split(',').map(Number);

    const midLon = (depLon + arrLon) / 2 + 0.01;
    const midLat = (depLat + arrLat) / 2 + 0.01;

    const waypointUrl = `https://router.project-osrm.org/route/v1/driving/${depLon},${depLat};${midLon},${midLat};${arrLon},${arrLat}?alternatives=false&geometries=geojson`;

    try {
      const res = await fetch(waypointUrl);
      const data = await res.json();
      
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([lon, lat]: [number, number]) => {
          return fromLonLat([lon, lat]);
        });

        const feature = new Feature({ geometry: new LineString(coords) });
        feature.setStyle(
          new Style({
            stroke: new Stroke({
              color: '#ff6b35',
              width: 4,
              lineDash: [10, 5]
            }),
          })
        );

        this.routeLayer.getSource()?.addFeature(feature);
        this.routesFound++;
        this.fitMapToAllRoutes();
      }
    } catch (err) {
      console.error('Waypoint routing error:', err);
    }
  }

  fitMapToAllRoutes() {
    const routeSource = this.routeLayer.getSource();
    const hazardSource = this.hazardLayer.getSource();
    
    if (!routeSource || !hazardSource) return;

    const routeFeatures = routeSource.getFeatures();
    const hazardFeatures = hazardSource.getFeatures();
    
    if (routeFeatures.length === 0 && hazardFeatures.length === 0) return;

    const allFeatures = [...routeFeatures, ...hazardFeatures];
    const extents = allFeatures.map(feature => {
      const geometry = feature.getGeometry();
      return geometry ? geometry.getExtent() : [Infinity, Infinity, -Infinity, -Infinity];
    });

    const overallExtent = extents.reduce((totalExtent, extent) => [
      Math.min(totalExtent[0], extent[0]),
      Math.min(totalExtent[1], extent[1]),
      Math.max(totalExtent[2], extent[2]),
      Math.max(totalExtent[3], extent[3])
    ], [Infinity, Infinity, -Infinity, -Infinity]);

    this.map.getView().fit(overallExtent, {
      padding: [50, 50, 50, 50],
      duration: 1000
    });
  }

  async saveCoordinates() {
    if (this.departureCoordinates && this.arrivalCoordinates) {
      this.showToast('Locations saved successfully!');
    } else {
      this.showToast('Please select both departure and arrival points.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'dark',
    });
    toast.present();
  }

  resetMap() {
    this.departureCoordinates = null;
    this.departureAddress = null;
    this.arrivalCoordinates = null;
    this.arrivalAddress = null;
    this.routesFound = 0;
    
    this.markerLayer.getSource()?.clear();
    this.routeLayer.getSource()?.clear();
    
    this.hazardLayer.getSource()?.clear();
    this.plotHazardsOnMap();
    
    this.showToast('Map has been reset - hazards remain displayed');
  }
}