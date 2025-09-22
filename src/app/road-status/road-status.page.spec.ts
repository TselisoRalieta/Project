import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoadStatusPage } from './road-status.page';

describe('RoadStatusPage', () => {
  let component: RoadStatusPage;
  let fixture: ComponentFixture<RoadStatusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
