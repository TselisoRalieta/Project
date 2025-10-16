import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherAdminPage } from './weather-admin.page';

describe('WeatherAdminPage', () => {
  let component: WeatherAdminPage;
  let fixture: ComponentFixture<WeatherAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
