import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPlaningComponent } from './trip-planing.component';

describe('TripPlaningComponent', () => {
  let component: TripPlaningComponent;
  let fixture: ComponentFixture<TripPlaningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripPlaningComponent]
    });
    fixture = TestBed.createComponent(TripPlaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
