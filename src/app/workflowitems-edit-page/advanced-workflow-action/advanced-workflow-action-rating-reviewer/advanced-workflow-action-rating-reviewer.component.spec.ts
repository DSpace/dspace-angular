import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedWorkflowActionRatingReviewerComponent } from './advanced-workflow-action-rating-reviewer.component';

describe('AdvancedWorkflowActionRatingReviewerComponent', () => {
  let component: AdvancedWorkflowActionRatingReviewerComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionRatingReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedWorkflowActionRatingReviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionRatingReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
