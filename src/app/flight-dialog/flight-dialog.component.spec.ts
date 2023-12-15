import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDialogComponent } from './flight-dialog.component';

describe('FlightDialogComponent', () => {
  let component: FlightDialogComponent;
  let fixture: ComponentFixture<FlightDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlightDialogComponent]
    });
    fixture = TestBed.createComponent(FlightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
