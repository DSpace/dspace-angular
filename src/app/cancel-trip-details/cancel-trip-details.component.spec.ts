import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTripDetailsComponent } from './cancel-trip-details.component';

describe('CancelTripDetailsComponent', () => {
  let component: CancelTripDetailsComponent;
  let fixture: ComponentFixture<CancelTripDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelTripDetailsComponent]
    });
    fixture = TestBed.createComponent(CancelTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
