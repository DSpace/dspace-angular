import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTripDailogComponent } from './cancel-trip-dailog.component';

describe('CancelTripDailogComponent', () => {
  let component: CancelTripDailogComponent;
  let fixture: ComponentFixture<CancelTripDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelTripDailogComponent]
    });
    fixture = TestBed.createComponent(CancelTripDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
