import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf, of } from 'rxjs';
import { OrgUnitSearchResultListElementComponent } from './org-unit-search-result-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { SupervisionOrderDataService } from '../../../../../core/supervision-order/supervision-order-data.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject } from '../../../../../shared/remote-data.utils';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { buildPaginatedList } from '../../../../../core/data/paginated-list.model';
import { GroupMock } from '../../../../../shared/testing/group-mock';
import { hot } from 'jasmine-marbles';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { EPersonDataService } from '../../../../../core/eperson/eperson-data.service';
import { ResourcePolicyDataService } from '../../../../../core/resource-policy/resource-policy-data.service';
import { AuthServiceStub } from '../../../../../shared/testing/auth-service.stub';
import { EPersonMock } from '../../../../../shared/testing/eperson.mock';

let orgUnitListElementComponent: OrgUnitSearchResultListElementComponent;
let fixture: ComponentFixture<OrgUnitSearchResultListElementComponent>;
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
        'dc.description': [
          {
            language: 'en_US',
            value: 'A description about the OrgUnit'
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

const supervisionOrderDataService: any = jasmine.createSpyObj('supervisionOrderDataService', {
  searchByItem: jasmine.createSpy('searchByItem'),
});

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

describe('OrgUnitSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }
      )],
      declarations: [ OrgUnitSearchResultListElementComponent , TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
        { provide: NotificationsService, useValue: {}},
        { provide: ResourcePolicyDataService, useValue: {}},
        { provide: AuthService, useValue: authService},
        { provide: EPersonDataService, useValue: {}},
        { provide: AuthorizationDataService, useValue: authorizationService},
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs }
      ],

      schemas: [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(OrgUnitSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
      a: paginatedListRD
    }));
    fixture = TestBed.createComponent(OrgUnitSearchResultListElementComponent);
    orgUnitListElementComponent = fixture.componentInstance;

  }));

  describe('with environment.browseBy.showThumbnails set to true', () => {
    beforeEach(() => {
      orgUnitListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });
    it('should set showThumbnails to true', () => {
      expect(orgUnitListElementComponent.showThumbnails).toBeTrue();
    });

    it('should add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeTruthy();
    });
  });

  describe('When the item has an org unit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the description span', () => {
      const orgUnitDescriptionField = fixture.debugElement.query(By.css('span.item-list-org-unit-description'));
      expect(orgUnitDescriptionField).not.toBeNull();
    });
  });

  describe('When the item has no org unit description', () => {
    beforeEach(() => {
      orgUnitListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the description span', () => {
      const orgUnitDescriptionField = fixture.debugElement.query(By.css('span.item-list-org-unit-description'));
      expect(orgUnitDescriptionField).toBeNull();
    });
  });
});

describe('OrgUnitSearchResultListElementComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }
      )],
      declarations: [OrgUnitSearchResultListElementComponent, TruncatePipe],
      providers: [
        {provide: TruncatableService, useValue: {}},
        {provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
        {provide: NotificationsService, useValue: {}},
        {provide: ResourcePolicyDataService, useValue: {}},
        {provide: AuthService, useValue: authService},
        {provide: EPersonDataService, useValue: {}},
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: DSONameService, useClass: DSONameServiceMock},
        { provide: APP_CONFIG, useValue: enviromentNoThumbs }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(OrgUnitSearchResultListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OrgUnitSearchResultListElementComponent);
    orgUnitListElementComponent = fixture.componentInstance;
  }));

  describe('with environment.browseBy.showThumbnails set to false', () => {
    beforeEach(() => {
      supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
        a: paginatedListRD
      }));
      orgUnitListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should not add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeNull();
    });
  });
});
