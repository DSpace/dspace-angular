import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { mockTruncatableService } from '../../../../../shared/mocks/mock-trucatable.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { WorkflowItemAdminWorkflowListElementComponent } from './workflow-item-admin-workflow-list-element.component';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { getMockLinkService } from '../../../../../shared/mocks/mock-link-service';

describe('WorkflowItemAdminWorkflowListElementComponent', () => {
  let component: WorkflowItemAdminWorkflowListElementComponent;
  let fixture: ComponentFixture<WorkflowItemAdminWorkflowListElementComponent>;
  let id;
  let wfi;
  let linkService;
  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    wfi = new WorkflowItem();
    linkService = getMockLinkService();
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule(
      {
        declarations: [WorkflowItemAdminWorkflowListElementComponent],
        imports: [
          NoopAnimationsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          SharedModule
        ],
        providers: [
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: LinkService, useValue: linkService },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    linkService.resolveLink.and.callFake((a) => a);
    fixture = TestBed.createComponent(WorkflowItemAdminWorkflowListElementComponent);
    component = fixture.componentInstance;
    component.object = wfi;
    component.linkTypes = CollectionElementLinkType;
    component.index = 0;
    component.viewModes = ViewMode;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
