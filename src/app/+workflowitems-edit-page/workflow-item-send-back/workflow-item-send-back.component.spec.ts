import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowItemSendBackComponent } from './workflow-item-send-back.component';


describe('WorkflowItemSendBackComponent', () => {
  let component: WorkflowItemSendBackComponent;
  let fixture: ComponentFixture<WorkflowItemSendBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowItemSendBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowItemSendBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
