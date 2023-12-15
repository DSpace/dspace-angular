import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmTripDetailsComponent } from './confirm-trip-details.component';

describe('ConfirmTripDetailsComponent', () => {
  let component: ConfirmTripDetailsComponent;
  let fixture: ComponentFixture<ConfirmTripDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmTripDetailsComponent]
    });
    fixture = TestBed.createComponent(ConfirmTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
