import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

type RegionName = 'Lowlands' | 'Highlands';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
  standalone: false,
})
export class WeatherPage implements OnInit {
  today: Date = new Date(); // current date, will show 19 September 2025

  weatherData: any; // country-level weather
  districtWeather: any[] = [];
  regionWeather: any[] = [];
  forecastData: any = {}; // store 5-day forecast for cities
  showForecast: Record<string, boolean> = {}; // toggle dropdown for each city/region

  private apiKey: string = '2d87f6cd37e0cd6d5f8a0473edc8756d';

  regionDistricts: Record<RegionName, string[]> = {
    Lowlands: ['Maseru', 'Berea', 'Leribe', 'Butha-Buthe', 'Mafeteng'],
    Highlands: ['Thaba-Tseka', 'Mokhotlong', 'Qacha\'s Nek', 'Quthing']
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCountryWeather();
    this.getRegionAndDistrictWeather();
  }

  // Current weather
  getCountryWeather() {
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=Maseru&units=metric&appid=${this.apiKey}`)
      .subscribe({
        next: data => {
          this.weatherData = data;
          this.loadForecast('Maseru'); // load 5-day forecast
        },
        error: err => console.error(err)
      });
  }

  // Fetch districts and region averages
  getRegionAndDistrictWeather() {
    for (const regionName of Object.keys(this.regionDistricts) as RegionName[]) {
      const districts = this.regionDistricts[regionName];
      const districtRequests: Observable<any>[] = [];

      districts.forEach((district: string) => {
        districtRequests.push(
          this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${district}&units=metric&appid=${this.apiKey}`)
        );
        this.loadForecast(district); // load forecast for each district
      });

      forkJoin(districtRequests).subscribe({
        next: (results: any[]) => {
          const temps: number[] = [];
          const descriptions: string[] = [];

          results.forEach((data, index) => {
            this.districtWeather.push({ name: districts[index], data });
            temps.push(data.main.temp);
            descriptions.push(data.weather[0].main);
          });

          const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
          const mainWeather = this.getMostFrequent(descriptions);

          this.regionWeather.push({
            name: regionName,
            data: {
              main: { temp: avgTemp },
              weather: [{ main: mainWeather, description: mainWeather }]
            }
          });

          this.loadForecast(regionName); // load forecast for region
        },
        error: err => console.error(err)
      });
    }
  }

  // Load 5-day forecast for a city or region
  loadForecast(cityOrRegion: string) {
    this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityOrRegion}&units=metric&appid=${this.apiKey}`)
      .subscribe({
        next: (data: any) => {
          // Keep only one forecast per day (daily)
          const dailyForecast = data.list.filter((item: any) => item.dt_txt.includes("12:00:00"));
          this.forecastData[cityOrRegion] = dailyForecast;
        },
        error: err => console.error(err)
      });
  }

  toggleForecast(name: string) {
    this.showForecast[name] = !this.showForecast[name];
  }

  getMostFrequent(arr: string[]): string {
    const freq: Record<string, number> = {};
    let max = 0;
    let result = arr[0] || 'Clear';
    arr.forEach(item => {
      freq[item] = (freq[item] || 0) + 1;
      if (freq[item] > max) {
        max = freq[item];
        result = item;
      }
    });
    return result;
  }

  getWeatherIcon(main: string): string {
    main = main.toLowerCase();
    switch (main) {
      case 'rain': return 'rainy-outline';
      case 'clouds': return 'cloud-outline';
      case 'clear': return 'sunny-outline';
      default: return 'partly-sunny-outline';
    }
  }

  formatDate(dtTxt: string): string {
    const date = new Date(dtTxt);
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
