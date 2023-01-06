import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedWorkflowActionsLoaderComponent } from './advanced-workflow-actions-loader.component';
import { Router } from '@angular/router';
import { RouterStub } from '../../../shared/testing/router.stub';

describe('AdvancedWorkflowActionsLoaderComponent', () => {
  let component: AdvancedWorkflowActionsLoaderComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionsLoaderComponent>;

  let router: RouterStub;

  beforeEach(async () => {
    router = new RouterStub();

    await TestBed.configureTestingModule({
      declarations: [
        AdvancedWorkflowActionsLoaderComponent,
      ],
      providers: [
        { provide: Router, useValue: router },
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
