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
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { getMockLinkService } from '../../../../../../modules/core/src/lib/core/mocks/link-service.mock';
import { WorkflowItemSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/workflow-item-search-result.model';
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { WorkflowItem } from '../../../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { createSuccessfulRemoteDataObject } from '../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
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
  bundles: observableOf({}),
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
mockResultObject.indexableObject = Object.assign(new WorkflowItem(), { item: observableOf(rd) });

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
