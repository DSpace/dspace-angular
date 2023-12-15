import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuallyTripDetailComponent } from './manually-trip-detail.component';

describe('ManuallyTripDetailComponent', () => {
  let component: ManuallyTripDetailComponent;
  let fixture: ComponentFixture<ManuallyTripDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManuallyTripDetailComponent]
    });
    fixture = TestBed.createComponent(ManuallyTripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
