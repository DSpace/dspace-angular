import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf, of } from 'rxjs';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { PersonSearchResultListElementComponent } from './person-search-result-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { SupervisionOrderDataService } from '../../../../../core/supervision-order/supervision-order-data.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../../../../shared/remote-data.utils';
import { hot } from 'jasmine-marbles';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { GroupMock } from '../../../../../shared/testing/group-mock';
import { buildPaginatedList } from '../../../../../core/data/paginated-list.model';
import { AuthServiceStub } from '../../../../../shared/testing/auth-service.stub';
import { EPersonMock } from '../../../../../shared/testing/eperson.mock';
import { ResourcePolicyDataService } from '../../../../../core/resource-policy/resource-policy-data.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { EPersonDataService } from '../../../../../core/eperson/eperson-data.service';

let personListElementComponent: PersonSearchResultListElementComponent;
let fixture: ComponentFixture<PersonSearchResultListElementComponent>;
const supervisionOrderDataService: any = jasmine.createSpyObj('supervisionOrderDataService', {
  searchByItem: jasmine.createSpy('searchByItem'),
});
let authorizationService = jasmine.createSpyObj('authorizationService', {
  isAuthorized: observableOf(true)
});

const authService: AuthServiceStub = Object.assign(new AuthServiceStub(), {
  getAuthenticatedUserFromStore: () => {
    return of(EPersonMock);
  }
});

const mockItemWithMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title'
          }
        ],
        'person.jobTitle': [
          {
            language: 'en_US',
            value: 'Developer'
          }
        ]
      }
    })
  });
const mockItemWithoutMetadata: ItemSearchResult = Object.assign(
  new ItemSearchResult(),
  {
    indexableObject: Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title'
          }
        ]
      }
    })
  });

const environmentUseThumbs = {
  browseBy: {
    showThumbnails: true
  }
};

const enviromentNoThumbs = {
  browseBy: {
    showThumbnails: false
  }
};

const supervisionOrder: any = {
  id: '1',
  type: 'supervisionOrder',
  uuid: 'supervision-order-1',
  _links: {
    item: {
      href: 'https://rest.api/rest/api/eperson'
    },
    group: {
      href: 'https://rest.api/rest/api/group'
    },
    self: {
      href: 'https://rest.api/rest/api/supervisionorders/1'
    },
  },
  item: observableOf(createSuccessfulRemoteDataObject({})),
  group: observableOf(createSuccessfulRemoteDataObject(GroupMock))
};
const anothersupervisionOrder: any = {
  id: '2',
  type: 'supervisionOrder',
  uuid: 'supervision-order-2',
  _links: {
    item: {
      href: 'https://rest.api/rest/api/eperson'
    },
    group: {
      href: 'https://rest.api/rest/api/group'
    },
    self: {
      href: 'https://rest.api/rest/api/supervisionorders/1'
    },
  },
  item: observableOf(createSuccessfulRemoteDataObject({})),
  group: observableOf(createSuccessfulRemoteDataObject(GroupMock))
};

const pageInfo = new PageInfo();
const array = [supervisionOrder, anothersupervisionOrder];
const paginatedList = buildPaginatedList(pageInfo, array);
const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);

describe('PersonSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }
      )],
      declarations: [PersonSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
        { provide: NotificationsService, useValue: {} },
        { provide: ResourcePolicyDataService, useValue: {}},
        { provide: AuthService, useValue: authService},
        { provide: EPersonDataService, useValue: {}},
        { provide: AuthorizationDataService, useValue: authorizationService},
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PersonSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
      a: paginatedListRD
    }));
    fixture = TestBed.createComponent(PersonSearchResultListElementComponent);
    personListElementComponent = fixture.componentInstance;

  }));

  describe('with environment.browseBy.showThumbnails set to true', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });
    it('should set showThumbnails to true', () => {
      expect(personListElementComponent.showThumbnails).toBeTrue();
    });

    it('should add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeTruthy();
    });
  });

  describe('When the item has a job title', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the job title span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-job-title'));
      expect(jobTitleField).not.toBeNull();
    });
  });

  describe('When the item has no job title', () => {
    beforeEach(() => {
      personListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the job title span', () => {
      const jobTitleField = fixture.debugElement.query(By.css('span.item-list-job-title'));
      expect(jobTitleField).toBeNull();
    });
  });
});

describe('PersonSearchResultListElementComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }
      )],
      declarations: [PersonSearchResultListElementComponent, TruncatePipe],
      providers: [
        {provide: TruncatableService, useValue: {}},
        {provide: SupervisionOrderDataService, useValue: supervisionOrderDataService},
        {provide: NotificationsService, useValue: {}},
        {provide: ResourcePolicyDataService, useValue: {}},
        {provide: AuthService, useValue: authService},
        {provide: EPersonDataService, useValue: {}},
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: DSONameService, useClass: DSONameServiceMock},
        { provide: APP_CONFIG, useValue: enviromentNoThumbs }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PersonSearchResultListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PersonSearchResultListElementComponent);
    personListElementComponent = fixture.componentInstance;
  }));

  describe('with environment.browseBy.showThumbnails set to false', () => {
    beforeEach(() => {
      supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
        a: paginatedListRD
      }));
      personListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should not add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeFalsy();
    });
  });
});
