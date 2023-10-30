import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionSuggestionComponent } from './correction-suggestion.component';

describe('CorrectionSuggestionComponent', () => {
  let component: CorrectionSuggestionComponent;
  let fixture: ComponentFixture<CorrectionSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectionSuggestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectionSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
