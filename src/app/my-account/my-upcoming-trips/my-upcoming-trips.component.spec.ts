import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUpcomingTripsComponent } from './my-upcoming-trips.component';

describe('MyUpcomingTripsComponent', () => {
  let component: MyUpcomingTripsComponent;
  let fixture: ComponentFixture<MyUpcomingTripsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyUpcomingTripsComponent]
    });
    fixture = TestBed.createComponent(MyUpcomingTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
