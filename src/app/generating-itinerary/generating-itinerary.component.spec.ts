import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingItineraryComponent } from './generating-itinerary.component';

describe('GeneratingItineraryComponent', () => {
  let component: GeneratingItineraryComponent;
  let fixture: ComponentFixture<GeneratingItineraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneratingItineraryComponent]
    });
    fixture = TestBed.createComponent(GeneratingItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
