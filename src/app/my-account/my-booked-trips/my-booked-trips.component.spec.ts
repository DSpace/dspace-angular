import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookedTripsComponent } from './my-booked-trips.component';

describe('MyBookedTripsComponent', () => {
  let component: MyBookedTripsComponent;
  let fixture: ComponentFixture<MyBookedTripsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyBookedTripsComponent]
    });
    fixture = TestBed.createComponent(MyBookedTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
