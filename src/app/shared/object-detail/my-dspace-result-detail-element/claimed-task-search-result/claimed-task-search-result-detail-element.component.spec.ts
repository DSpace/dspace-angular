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
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { ObjectCacheService } from '../../../../../../modules/core/src/lib/core/cache/object-cache.service';
import { getMockLinkService } from '../../../../../../modules/core/src/lib/core/mocks/link-service.mock';
import { ClaimedTaskSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/claimed-task-search-result.model';
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { WorkflowItem } from '../../../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../../../modules/core/src/lib/core/tasks/models/claimed-task-object.model';
import { createSuccessfulRemoteDataObject } from '../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { ClaimedTaskActionsComponent } from '../../../mydspace-actions/claimed-task/claimed-task-actions.component';
import { VarDirective } from '../../../utils/var.directive';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { ClaimedTaskSearchResultDetailElementComponent } from './claimed-task-search-result-detail-element.component';

let component: ClaimedTaskSearchResultDetailElementComponent;
let fixture: ComponentFixture<ClaimedTaskSearchResultDetailElementComponent>;

const compIndex = 1;

const mockResultObject: ClaimedTaskSearchResult = new ClaimedTaskSearchResult();
mockResultObject.hitHighlights = {};

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
const rdItem = createSuccessfulRemoteDataObject(item);
const workflowitem = Object.assign(new WorkflowItem(), { item: observableOf(rdItem) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockResultObject.indexableObject = Object.assign(new ClaimedTask(), { workflowitem: observableOf(rdWorkflowitem) });
const linkService = getMockLinkService();
const objectCacheServiceMock = jasmine.createSpyObj('ObjectCacheService', {
  remove: jasmine.createSpy('remove'),
});

describe('ClaimedTaskSearchResultDetailElementComponent', () => {
  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, VarDirective, ClaimedTaskSearchResultDetailElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: LinkService, useValue: linkService },
        { provide: ObjectCacheService, useValue: objectCacheServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedTaskSearchResultDetailElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ItemDetailPreviewComponent, ClaimedTaskActionsComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ClaimedTaskSearchResultDetailElementComponent);
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
    expect(component.badgeContext).toEqual(Context.MyDSpaceValidation);
  });

  it('should forward claimed-task-actions processComplete event to reloadObject event emitter', fakeAsync(() => {
    spyOn(component.reloadedObject, 'emit').and.callThrough();
    const actionPayload: any = { reloadedObject: {} };

    const actionsComponent = fixture.debugElement.query(By.css('ds-claimed-task-actions'));
    actionsComponent.triggerEventHandler('processCompleted', actionPayload);
    tick();

    expect(component.reloadedObject.emit).toHaveBeenCalledWith(actionPayload.reloadedObject);

  }));
});
