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

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { Context } from '../../../../core/shared/context.model';
import { Item } from '../../../../core/shared/item.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { SubmissionDuplicateDataService } from '../../../../core/submission/submission-duplicate-data.service';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { DSONameServiceMock } from '../../../mocks/dso-name.service.mock';
import { getMockLinkService } from '../../../mocks/link-service.mock';
import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { PoolTaskActionsComponent } from '../../../mydspace-actions/pool-task/pool-task-actions.component';
import { PoolTaskSearchResult } from '../../../object-collection/shared/pool-task-search-result.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { ThemeService } from '../../../theme-support/theme.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { VarDirective } from '../../../utils/var.directive';
import { ThemedItemListPreviewComponent } from '../item-list-preview/themed-item-list-preview.component';
import { PoolSearchResultListElementComponent } from './pool-search-result-list-element.component';

let component: PoolSearchResultListElementComponent;
let fixture: ComponentFixture<PoolSearchResultListElementComponent>;

const mockResultObject: PoolTaskSearchResult = new PoolTaskSearchResult();
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
  duplicates: observableOf([]),
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

const rdItem = createSuccessfulRemoteDataObject(item);
const workflowitem = Object.assign(new WorkflowItem(), { item: observableOf(rdItem) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockResultObject.indexableObject = Object.assign(new PoolTask(), { workflowitem: observableOf(rdWorkflowitem) });
const linkService = getMockLinkService();
const objectCacheServiceMock = jasmine.createSpyObj('ObjectCacheService', {
  remove: jasmine.createSpy('remove'),
});

describe('PoolSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, VarDirective, PoolSearchResultListElementComponent],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs },
        { provide: ObjectCacheService, useValue: objectCacheServiceMock },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: SubmissionDuplicateDataService, useValue: duplicateDataServiceStub },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(PoolSearchResultListElementComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [ThemedItemListPreviewComponent, PoolTaskActionsComponent],
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PoolSearchResultListElementComponent);
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

  it('should have correct badge context', () => {
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

  it('should add an offset to the actions element', () => {
    const thumbnail = fixture.debugElement.query(By.css('.offset-3'));
    expect(thumbnail).toBeTruthy();
  });
});
