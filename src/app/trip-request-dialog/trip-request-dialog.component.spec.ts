import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRequestDialogComponent } from './trip-request-dialog.component';

describe('TripRequestDialogComponent', () => {
  let component: TripRequestDialogComponent;
  let fixture: ComponentFixture<TripRequestDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripRequestDialogComponent]
    });
    fixture = TestBed.createComponent(TripRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
