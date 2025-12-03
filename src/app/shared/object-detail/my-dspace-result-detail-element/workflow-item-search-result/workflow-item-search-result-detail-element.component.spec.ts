import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { WorkflowItemSearchResult } from '@dspace/core/shared/object-collection/workflow-item-search-result.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { getMockLinkService } from '@dspace/core/testing/link-service.mock';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

import { WorkflowitemActionsComponent } from '../../../mydspace-actions/workflowitem/workflowitem-actions.component';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { WorkflowItemSearchResultDetailElementComponent } from './workflow-item-search-result-detail-element.component';

let component: WorkflowItemSearchResultDetailElementComponent;
let fixture: ComponentFixture<WorkflowItemSearchResultDetailElementComponent>;

const compIndex = 1;

const mockResultObject: WorkflowItemSearchResult = new WorkflowItemSearchResult();
mockResultObject.hitHighlights = {};
const linkService = getMockLinkService();

const item = Object.assign(new Item(), {
  bundles: of({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article',
      },
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
  },
});
const rd = createSuccessfulRemoteDataObject(item);
mockResultObject.indexableObject = Object.assign(new WorkflowItem(), { item: of(rd) });

describe('WorkflowItemSearchResultDetailElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, WorkflowItemSearchResultDetailElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockResultObject) },
        { provide: 'indexElementProvider', useValue: (compIndex) },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(WorkflowItemSearchResultDetailElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ItemDetailPreviewComponent, WorkflowitemActionsComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WorkflowItemSearchResultDetailElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init item properly', () => {
    expect(component.item).toEqual(item);
  });

  it('should have the correct badge context', () => {
    expect(component.badgeContext).toEqual(Context.MyDSpaceWorkflow);
  });
});
