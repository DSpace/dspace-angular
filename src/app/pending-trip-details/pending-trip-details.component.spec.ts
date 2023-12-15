import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingTripDetailsComponent } from './pending-trip-details.component';

describe('PendingTripDetailsComponent', () => {
  let component: PendingTripDetailsComponent;
  let fixture: ComponentFixture<PendingTripDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingTripDetailsComponent]
    });
    fixture = TestBed.createComponent(PendingTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
