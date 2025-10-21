import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminHazardPage } from './admin-hazard.page';

describe('AdminHazardPage', () => {
  let component: AdminHazardPage;
  let fixture: ComponentFixture<AdminHazardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHazardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
