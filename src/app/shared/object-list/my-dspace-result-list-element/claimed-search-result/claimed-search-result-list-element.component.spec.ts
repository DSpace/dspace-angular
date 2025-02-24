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
import {
  APP_CONFIG,
  ClaimedTask,
  ClaimedTaskSearchResult,
  ConfigurationDataService,
  ConfigurationProperty,
  Context,
  createPaginatedList,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
  DSONameService,
  getMockLinkService,
  Item,
  LinkService,
  NotificationsService,
  NotificationsServiceStub,
  ObjectCacheService,
  SearchService,
  SearchServiceStub,
  SubmissionDuplicateDataService,
  WorkflowItem,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { mockTruncatableService } from '../../../mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { ClaimedTaskActionsComponent } from '../../../mydspace-actions/claimed-task/claimed-task-actions.component';
import { ThemeService } from '../../../theme-support/theme.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { VarDirective } from '../../../utils/var.directive';
import { ThemedItemListPreviewComponent } from '../item-list-preview/themed-item-list-preview.component';
import { ClaimedSearchResultListElementComponent } from './claimed-search-result-list-element.component';

let component: ClaimedSearchResultListElementComponent;
let fixture: ComponentFixture<ClaimedSearchResultListElementComponent>;

const mockResultObject: ClaimedTaskSearchResult = new ClaimedTaskSearchResult();
mockResultObject.hitHighlights = {};

const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

const configurationDataService = jasmine.createSpyObj('configurationDataService', {
  findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
    name: 'duplicate.enable',
    values: [
      'true',
    ],
  })),
});
const duplicateDataServiceStub = {
  findListByHref: () => observableOf(emptyList),
  findDuplicates: () => createSuccessfulRemoteDataObject$({}),
};

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

describe('ClaimedSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        VarDirective,
        ClaimedSearchResultListElementComponent,
      ],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: SearchService, useValue: new SearchServiceStub() },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ObjectCacheService, useValue: objectCacheServiceMock },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: SubmissionDuplicateDataService, useValue: duplicateDataServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedSearchResultListElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ThemedItemListPreviewComponent, ClaimedTaskActionsComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ClaimedSearchResultListElementComponent);
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
