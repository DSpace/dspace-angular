import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';

import { DSONameService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import { APP_CONFIG } from '@dspace/core';
import { ItemDataService } from '@dspace/core';
import { getMockLinkService } from '@dspace/core';
import { WorkflowItemSearchResult } from '@dspace/core';
import { Context } from '@dspace/core';
import { Item } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';
import { createSuccessfulRemoteDataObject } from '@dspace/core';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../../mocks/mock-trucatable.service';
import { WorkflowitemActionsComponent } from '../../../mydspace-actions/workflowitem/workflowitem-actions.component';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { WorkflowItemSearchResultListElementComponent } from './workflow-item-search-result-list-element.component';


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

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true,
  },
};

const rd = createSuccessfulRemoteDataObject(item);
mockResultObject.indexableObject = Object.assign(new WorkflowItem(), { item: observableOf(rd) });

let linkService;

describe('WorkflowItemSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    linkService = getMockLinkService();
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, WorkflowItemSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: ItemDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(WorkflowItemSearchResultListElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ListableObjectComponentLoaderComponent, WorkflowitemActionsComponent, ThemedLoadingComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WorkflowItemSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.object = mockResultObject;
    fixture.detectChanges();
  });

  it('should init derivedSearchResult$ properly', (done) => {
    component.derivedSearchResult$.pipe(take(1)).subscribe((i) => {
      expect(linkService.resolveLink).toHaveBeenCalled();
      expect(i.indexableObject).toBe(item);
      expect(i.hitHighlights).toBe(mockResultObject.hitHighlights);
      done();
    });
  });

  it('should have the correct badge context', () => {
    expect(component.badgeContext).toEqual(Context.MyDSpaceWorkflow);
  });

  it('should forward workflowitem-actions processCompleted event to the reloadedObject event emitter', fakeAsync(() => {
    spyOn(component.reloadedObject, 'emit').and.callThrough();
    const actionPayload: any = { reloadedObject: {} };

    const actionsComponent = fixture.debugElement.query(By.css('ds-workflowitem-actions'));
    actionsComponent.triggerEventHandler('processCompleted', actionPayload);
    tick();

    expect(component.reloadedObject.emit).toHaveBeenCalledWith(actionPayload.reloadedObject);

  }));

  it('should add an offset to the actions element', () => {
    const thumbnail = fixture.debugElement.query(By.css('.offset-3'));
    expect(thumbnail).toBeTruthy();
  });

});
