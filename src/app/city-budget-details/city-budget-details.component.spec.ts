import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityBudgetDetailsComponent } from './city-budget-details.component';

describe('CityBudgetDetailsComponent', () => {
  let component: CityBudgetDetailsComponent;
  let fixture: ComponentFixture<CityBudgetDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CityBudgetDetailsComponent]
    });
    fixture = TestBed.createComponent(CityBudgetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
