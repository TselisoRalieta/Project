import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallCenterPage } from './call-center.page';

describe('CallCenterPage', () => {
  let component: CallCenterPage;
  let fixture: ComponentFixture<CallCenterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CallCenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
