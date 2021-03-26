import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { ItemDataService } from '../../../../core/data/item-data.service';

import { Item } from '../../../../core/shared/item.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { getMockLinkService } from '../../../mocks/link-service.mock';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { WorkflowItemSearchResult } from '../../../object-collection/shared/workflow-item-search-result.model';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { WorkflowItemSearchResultListElementComponent } from './workflow-item-search-result-list-element.component';
import { By } from '@angular/platform-browser';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';

let component: WorkflowItemSearchResultListElementComponent;
let fixture: ComponentFixture<WorkflowItemSearchResultListElementComponent>;

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
mockResultObject.indexableObject = Object.assign(new WorkflowItem(), { item: observableOf(rd) });

let linkService;

describe('WorkflowItemSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    linkService = getMockLinkService();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [WorkflowItemSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(WorkflowItemSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WorkflowItemSearchResultListElementComponent);
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
    expect(component.status).toEqual(MyDspaceItemStatusType.WORKFLOW);
  });

  it('should forward workflowitem-actions processCompleted event to the reloadedObject event emitter', fakeAsync(() => {
    spyOn(component.reloadedObject, 'emit').and.callThrough();
    const actionPayload: any = { reloadedObject: {}};

    const actionsComponent = fixture.debugElement.query(By.css('ds-workflowitem-actions'));
    actionsComponent.triggerEventHandler('processCompleted', actionPayload);
    tick();

    expect(component.reloadedObject.emit).toHaveBeenCalledWith(actionPayload.reloadedObject);

  }));
});
