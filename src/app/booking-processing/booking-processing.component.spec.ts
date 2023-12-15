import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingProcessingComponent } from './booking-processing.component';

describe('BookingProcessingComponent', () => {
  let component: BookingProcessingComponent;
  let fixture: ComponentFixture<BookingProcessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingProcessingComponent]
    });
    fixture = TestBed.createComponent(BookingProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
