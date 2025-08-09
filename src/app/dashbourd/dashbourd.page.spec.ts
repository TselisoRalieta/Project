import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashbourdPage } from './dashbourd.page';

describe('DashbourdPage', () => {
  let component: DashbourdPage;
  let fixture: ComponentFixture<DashbourdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbourdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
