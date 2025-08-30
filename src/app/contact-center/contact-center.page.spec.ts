import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactCenterPage } from './contact-center.page';

describe('ContactCenterPage', () => {
  let component: ContactCenterPage;
  let fixture: ComponentFixture<ContactCenterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
