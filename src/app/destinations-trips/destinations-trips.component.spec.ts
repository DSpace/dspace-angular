import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsTripsComponent } from './destinations-trips.component';

describe('DestinationsTripsComponent', () => {
  let component: DestinationsTripsComponent;
  let fixture: ComponentFixture<DestinationsTripsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinationsTripsComponent]
    });
    fixture = TestBed.createComponent(DestinationsTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
