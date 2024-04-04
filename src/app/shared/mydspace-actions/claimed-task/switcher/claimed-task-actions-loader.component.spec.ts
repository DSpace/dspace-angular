import {
  ChangeDetectionStrategy,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';

import { RequestService } from '../../../../core/data/request.service';
import { Item } from '../../../../core/shared/item.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { PoolTaskDataService } from '../../../../core/tasks/pool-task-data.service';
import { ActivatedRouteStub } from '../../../../shared/testing/active-router.stub';
import { DynamicComponentLoaderDirective } from '../../../abstract-component-loader/dynamic-component-loader.directive';
import { getMockRequestService } from '../../../mocks/request.service.mock';
import { getMockSearchService } from '../../../mocks/search-service.mock';
import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../../testing/notifications-service.stub';
import { RouterStub } from '../../../testing/router.stub';
import { ClaimedTaskActionsEditMetadataComponent } from '../edit-metadata/claimed-task-actions-edit-metadata.component';
import { ClaimedTaskActionsLoaderComponent } from './claimed-task-actions-loader.component';

const searchService = getMockSearchService();

const requestService = getMockRequestService();

describe('ClaimedTaskActionsLoaderComponent', () => {
  let comp: ClaimedTaskActionsLoaderComponent;
  let fixture: ComponentFixture<ClaimedTaskActionsLoaderComponent>;
  let themeService: ThemeService;

  const option = 'test_option';
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });

  const item = Object.assign(new Item(), {
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

  const workflowitem = Object.assign(new WorkflowItem(), { id: '333' });

  beforeEach(waitForAsync(() => {
    themeService = getMockThemeService('dspace');

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(),
        ClaimedTaskActionsLoaderComponent,
        ClaimedTaskActionsEditMetadataComponent,
        DynamicComponentLoaderDirective,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ClaimedTaskDataService, useValue: {} },
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestService },
        { provide: PoolTaskDataService, useValue: {} },
        { provide: ThemeService, useValue: themeService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).overrideComponent(ClaimedTaskActionsLoaderComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsLoaderComponent);
    comp = fixture.componentInstance;
    comp.item = item;
    comp.object = object;
    comp.option = option;
    comp.workflowitem = workflowitem;
    spyOn(comp, 'getComponent').and.returnValue(ClaimedTaskActionsEditMetadataComponent);

    fixture.detectChanges();
  }));

  describe('When the component is rendered', () => {
    it('should call the getComponent function', () => {
      expect(comp.getComponent).toHaveBeenCalled();
    });
  });
});
