import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripHeaderComponent } from './trip-header.component';

describe('TripHeaderComponent', () => {
  let component: TripHeaderComponent;
  let fixture: ComponentFixture<TripHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripHeaderComponent]
    });
    fixture = TestBed.createComponent(TripHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
