import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { PoolTaskSearchResult } from '@dspace/core/shared/object-collection/pool-task-search-result.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { PoolTask } from '@dspace/core/tasks/models/pool-task-object.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { getMockLinkService } from '@dspace/core/testing/link-service.mock';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

import { PoolTaskActionsComponent } from '../../../mydspace-actions/pool-task/pool-task-actions.component';
import { VarDirective } from '../../../utils/var.directive';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { PoolSearchResultDetailElementComponent } from './pool-search-result-detail-element.component';

let component: PoolSearchResultDetailElementComponent;
let fixture: ComponentFixture<PoolSearchResultDetailElementComponent>;

const compIndex = 1;

const mockResultObject: PoolTaskSearchResult = new PoolTaskSearchResult();
mockResultObject.hitHighlights = {};

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
const rdItem = createSuccessfulRemoteDataObject(item);
const workflowitem = Object.assign(new WorkflowItem(), { item: of(rdItem) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockResultObject.indexableObject = Object.assign(new PoolTask(), { workflowitem: of(rdWorkflowitem) });
const linkService = getMockLinkService();
const objectCacheServiceMock = jasmine.createSpyObj('ObjectCacheService', {
  remove: jasmine.createSpy('remove'),
});

describe('PoolSearchResultDetailElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, VarDirective, PoolSearchResultDetailElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: 'objectElementProvider', useValue: (mockResultObject) },
        { provide: 'indexElementProvider', useValue: (compIndex) },
        { provide: LinkService, useValue: linkService },
        { provide: ObjectCacheService, useValue: objectCacheServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PoolSearchResultDetailElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ItemDetailPreviewComponent, PoolTaskActionsComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PoolSearchResultDetailElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init workflowitem properly', fakeAsync(() => {
    flush();
    expect(linkService.resolveLinks).toHaveBeenCalledWith(
      component.dso,
      jasmine.objectContaining({ name: 'workflowitem' }),
      jasmine.objectContaining({ name: 'action' }),
    );
    expect(component.workflowitem$.value).toEqual(workflowitem);
    expect(component.item$.value).toEqual(item);
  }));

  it('should have the correct badge context', () => {
    expect(component.badgeContext).toEqual(Context.MyDSpaceWaitingController);
  });

  it('should forward pool-task-actions processCompleted event to the reloadedObject event emitter', fakeAsync(() => {
    spyOn(component.reloadedObject, 'emit').and.callThrough();
    const actionPayload: any = { reloadedObject: {} };
    const actionsComponents = fixture.debugElement.query(By.css('ds-pool-task-actions'));
    actionsComponents.triggerEventHandler('processCompleted', actionPayload);
    tick();

    expect(component.reloadedObject.emit).toHaveBeenCalledWith(actionPayload.reloadedObject);

  }));
});
