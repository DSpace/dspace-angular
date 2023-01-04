import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedWorkflowActionComponent } from './advanced-workflow-action.component';

describe('AdvancedWorkflowActionComponent', () => {
  let component: AdvancedWorkflowActionComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedWorkflowActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
