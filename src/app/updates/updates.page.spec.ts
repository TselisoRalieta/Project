import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatesPage } from './updates.page';

describe('UpdatesPage', () => {
  let component: UpdatesPage;
  let fixture: ComponentFixture<UpdatesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
