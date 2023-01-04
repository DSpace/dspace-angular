import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionsLoaderComponent } from './advanced-workflow-actions-loader.component';

describe('AdvancedWorkflowActionsLoaderComponent', () => {
  let component: AdvancedWorkflowActionsLoaderComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdvancedWorkflowActionsLoaderComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedWorkflowActionsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
