import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailsLoginComponent } from './trip-details-login.component';

describe('TripDetailsLoginComponent', () => {
  let component: TripDetailsLoginComponent;
  let fixture: ComponentFixture<TripDetailsLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripDetailsLoginComponent]
    });
    fixture = TestBed.createComponent(TripDetailsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
