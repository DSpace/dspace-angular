import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { RoleService } from '../core/roles/role.service';
import { Context } from '../core/shared/context.model';
import { SearchService } from '../core/shared/search/search.service';
import { getMockThemeService } from '../shared/mocks/theme-service.mock';
import { RoleDirective } from '../shared/roles/role.directive';
import { ThemedSearchComponent } from '../shared/search/themed-search.component';
import { ThemeService } from '../shared/theme-support/theme.service';
import {
  MyDSpaceConfigurationService,
  SEARCH_CONFIG_SERVICE,
} from './my-dspace-configuration.service';
import { MyDSpaceConfigurationValueType } from './my-dspace-configuration-value-type';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import SpyObj = jasmine.SpyObj;
import { SuggestionsNotificationComponent } from '../notifications/suggestions/notification/suggestions-notification.component';
import { MyDspaceQaEventsNotificationsComponent } from './my-dspace-qa-events-notifications/my-dspace-qa-events-notifications.component';

describe('MyDSpacePageComponent', () => {
  let comp: MyDSpacePageComponent;
  let fixture: ComponentFixture<MyDSpacePageComponent>;
  let roleService: any;

  const searchServiceStub: SpyObj<SearchService> = jasmine.createSpyObj(
    'SearchService',
    {
      setServiceOptions: jasmine.createSpy('setServiceOptions'),
    },
  );

  const myDSpaceConfigurationServiceStub: SpyObj<MyDSpaceConfigurationService> =
    jasmine.createSpyObj('MyDSpaceConfigurationService', {
      getAvailableConfigurationOptions: jasmine.createSpy(
        'getAvailableConfigurationOptions',
      ),
    });

  const configurationList = [
    {
      value: MyDSpaceConfigurationValueType.Workspace,
      label: `mydspace.show.${MyDSpaceConfigurationValueType.Workspace}`,
      context: Context.Workspace,
    },
    {
      value: MyDSpaceConfigurationValueType.Workflow,
      label: `mydspace.show.${MyDSpaceConfigurationValueType.Workflow}`,
      context: Context.Workflow,
    },
  ];

  beforeEach(waitForAsync(() => {
    roleService = jasmine.createSpyObj('roleService', {
      checkRole: ()=> of(true),
    });
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule,
        NgbCollapseModule,
        MyDSpacePageComponent,
        RoleDirective,
      ],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        {
          provide: MyDSpaceConfigurationService,
          useValue: myDSpaceConfigurationServiceStub,
        },
        { provide: RoleService, useValue: roleService },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(MyDSpacePageComponent, {
        set: {
          providers: [
            {
              provide: SEARCH_CONFIG_SERVICE,
              useValue: myDSpaceConfigurationServiceStub,
            },
          ],
        },
      })
      .overrideComponent(MyDSpacePageComponent, {
        remove: {
          imports: [
            ThemedSearchComponent,
            MyDSpaceNewSubmissionComponent,
            SuggestionsNotificationComponent,
            MyDspaceQaEventsNotificationsComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDSpacePageComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    myDSpaceConfigurationServiceStub.getAvailableConfigurationOptions.and.returnValue(
      of(configurationList),
    );

    fixture.detectChanges();
  });

  afterEach(() => {
    comp = null;
  });

  it('should init properly context and configuration', fakeAsync(() => {
    expect(comp.configurationList$).toBeObservable(
      cold('(a|)', {
        a: configurationList,
      }),
    );

    flush();
    expect(comp.configuration).toBe(MyDSpaceConfigurationValueType.Workspace);
    expect(comp.context).toBe(Context.Workspace);
  }));
});
