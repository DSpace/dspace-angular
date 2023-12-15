import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTripDailogComponent } from './join-trip-dailog.component';

describe('JoinTripDailogComponent', () => {
  let component: JoinTripDailogComponent;
  let fixture: ComponentFixture<JoinTripDailogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoinTripDailogComponent]
    });
    fixture = TestBed.createComponent(JoinTripDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
