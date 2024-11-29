import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AdvancedWorkflowActionsLoaderComponent } from '../advanced-workflow-actions-loader/advanced-workflow-actions-loader.component';
import { AdvancedWorkflowActionPageComponent } from './advanced-workflow-action-page.component';

describe('AdvancedWorkflowActionPageComponent', () => {
  let component: AdvancedWorkflowActionPageComponent;
  let fixture: ComponentFixture<AdvancedWorkflowActionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        AdvancedWorkflowActionPageComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                workflow: 'testaction',
              },
            },
          },
        },
      ],
    }).overrideComponent(AdvancedWorkflowActionPageComponent, {
      remove: { imports: [AdvancedWorkflowActionsLoaderComponent] },
    })
      .compileComponents();
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
