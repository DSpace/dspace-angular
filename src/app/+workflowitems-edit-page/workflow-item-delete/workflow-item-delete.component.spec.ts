import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowItemDeleteComponent } from './workflow-item-delete.component';

describe('WorkflowItemDeleteComponent', () => {
  let component: WorkflowItemDeleteComponent;
  let fixture: ComponentFixture<WorkflowItemDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowItemDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowItemDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
