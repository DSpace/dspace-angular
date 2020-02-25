import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { ItemDataService } from '../../../../core/data/item-data.service';

import { Item } from '../../../../core/shared/item.model';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';
import { getMockLinkService } from '../../../mocks/mock-link-service';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { WorkflowItemSearchResult } from '../../../object-collection/shared/workflow-item-search-result.model';
import { createSuccessfulRemoteDataObject } from '../../../testing/utils';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { WorkspaceItemSearchResultListElementComponent } from './workspace-item-search-result-list-element.component';

let component: WorkspaceItemSearchResultListElementComponent;
let fixture: ComponentFixture<WorkspaceItemSearchResultListElementComponent>;

const compIndex = 1;

const mockResultObject: WorkflowItemSearchResult = new WorkflowItemSearchResult();
mockResultObject.hitHighlights = {};

const item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});
const rd = createSuccessfulRemoteDataObject(item);
mockResultObject.indexableObject = Object.assign(new WorkspaceItem(), { item: observableOf(rd) });
let linkService;

describe('WorkspaceItemSearchResultListElementComponent', () => {
  beforeEach(async(() => {
    linkService = getMockLinkService();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [WorkspaceItemSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(WorkspaceItemSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WorkspaceItemSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init item properly', (done) => {
    component.item$.pipe(take(1)).subscribe((i) => {
      expect(linkService.resolveLink).toHaveBeenCalled();
      expect(i).toBe(item);
      done();
    });
  });

  it('should have properly status', () => {
    expect(component.status).toEqual(MyDspaceItemStatusType.WORKSPACE);
  });
});
