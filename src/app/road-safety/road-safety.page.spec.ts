import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoadSafetyPage } from './road-safety.page';

describe('RoadSafetyPage', () => {
  let component: RoadSafetyPage;
  let fixture: ComponentFixture<RoadSafetyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadSafetyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
