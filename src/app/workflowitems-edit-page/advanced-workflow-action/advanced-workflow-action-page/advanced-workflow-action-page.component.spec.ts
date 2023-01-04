import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionPageComponent } from './advanced-workflow-action-page.component';

describe('AdvancedWorkflowActionPageComponent', () => {
  let component: AdvancedWorkflowActionPageComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdvancedWorkflowActionPageComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
