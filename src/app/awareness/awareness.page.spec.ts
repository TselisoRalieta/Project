import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AwarenessPage } from './awareness.page';

describe('AwarenessPage', () => {
  let component: AwarenessPage;
  let fixture: ComponentFixture<AwarenessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AwarenessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
