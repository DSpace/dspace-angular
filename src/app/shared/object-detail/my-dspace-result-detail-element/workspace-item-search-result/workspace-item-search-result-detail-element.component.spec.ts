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
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';

import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { getMockLinkService } from '../../../../../../modules/core/src/lib/core/mocks/link-service.mock';
import { WorkflowItemSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/workflow-item-search-result.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { WorkspaceItem } from '../../../../../../modules/core/src/lib/core/submission/models/workspaceitem.model';
import { createSuccessfulRemoteDataObject } from '../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { WorkspaceitemActionsComponent } from '../../../mydspace-actions/workspaceitem/workspaceitem-actions.component';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { WorkspaceItemSearchResultDetailElementComponent } from './workspace-item-search-result-detail-element.component';

let component: WorkspaceItemSearchResultDetailElementComponent;
let fixture: ComponentFixture<WorkspaceItemSearchResultDetailElementComponent>;

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
mockResultObject.indexableObject = Object.assign(new WorkspaceItem(), { item: observableOf(rd) });

describe('WorkspaceItemSearchResultDetailElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, WorkspaceItemSearchResultDetailElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockResultObject) },
        { provide: 'indexElementProvider', useValue: (compIndex) },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(WorkspaceItemSearchResultDetailElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [
          ItemDetailPreviewComponent,
          WorkspaceitemActionsComponent,
        ],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WorkspaceItemSearchResultDetailElementComponent);
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
    expect(component.badgeContext).toEqual(Context.MyDSpaceWorkspace);
  });
});
