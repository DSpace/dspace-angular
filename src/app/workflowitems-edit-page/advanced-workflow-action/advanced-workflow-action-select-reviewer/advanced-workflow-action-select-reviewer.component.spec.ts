import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedWorkflowActionSelectReviewerComponent } from './advanced-workflow-action-select-reviewer.component';

describe('AdvancedWorkflowActionSelectReviewerComponent', () => {
  let component: AdvancedWorkflowActionSelectReviewerComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionSelectReviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedWorkflowActionSelectReviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionSelectReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
