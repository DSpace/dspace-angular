import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetTripDetailsComponent } from './budget-trip-details.component';

describe('BudgetTripDetailsComponent', () => {
  let component: BudgetTripDetailsComponent;
  let fixture: ComponentFixture<BudgetTripDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetTripDetailsComponent]
    });
    fixture = TestBed.createComponent(BudgetTripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
