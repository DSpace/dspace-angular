import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf, of } from 'rxjs';
import { ItemSearchResult } from '../../../../../shared/object-collection/shared/item-search-result.model';
import { ProjectSearchResultListElementComponent } from './project-search-result-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../../shared/mocks/dso-name.service.mock';
import { By } from '@angular/platform-browser';
import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { SupervisionOrderDataService } from '../../../../../core/supervision-order/supervision-order-data.service';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
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
import { EPerson } from '../../../../../core/eperson/models/eperson.model';
import { createPaginatedList } from '../../../../../shared/testing/utils.test';

let projectListElementComponent: ProjectSearchResultListElementComponent;
let fixture: ComponentFixture<ProjectSearchResultListElementComponent>;
let authorizationService = jasmine.createSpyObj('authorizationService', {
  isAuthorized: observableOf(true)
});

const authService: AuthServiceStub = Object.assign(new AuthServiceStub(), {
  getAuthenticatedUserFromStore: () => {
    return of(EPersonMock);
  }
});

const user = Object.assign(new EPerson(), {
  id: 'userId',
  groups: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  _links: { self: { href: 'test.com/uuid/1234567654321' } }
});
const epersonService = jasmine.createSpyObj('epersonService', {
  findById: createSuccessfulRemoteDataObject$(user),
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
        // 'project.identifier.status': [
        //   {
        //     language: 'en_US',
        //     value: 'A status about the project'
        //   }
        // ]
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

describe('ProjectSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectSearchResultListElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} },
        { provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
        { provide: NotificationsService, useValue: {}},
        { provide: TranslateService, useValue: {}},
        { provide: ResourcePolicyDataService, useValue: {}},
        { provide: AuthService, useValue: authService},
        { provide: EPersonDataService, useValue: epersonService},
        { provide: AuthorizationDataService, useValue: authorizationService},
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environmentUseThumbs }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ProjectSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
      a: paginatedListRD
    }));
    fixture = TestBed.createComponent(ProjectSearchResultListElementComponent);
    projectListElementComponent = fixture.componentInstance;

  }));

  describe('with environment.browseBy.showThumbnails set to true', () => {
    beforeEach(() => {
      projectListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });
    it('should set showThumbnails to true', () => {
      expect(projectListElementComponent.showThumbnails).toBeTrue();
    });

    it('should add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeTruthy();
    });
  });

  // describe('When the item has a status', () => {
  //   beforeEach(() => {
  //     projectListElementComponent.item = mockItemWithMetadata;
  //     fixture.detectChanges();
  //   });
  //
  //   it('should show the status span', () => {
  //     const statusField = fixture.debugElement.query(By.css('span.item-list-status'));
  //     expect(statusField).not.toBeNull();
  //   });
  // });
  //
  // describe('When the item has no status', () => {
  //   beforeEach(() => {
  //     projectListElementComponent.item = mockItemWithoutMetadata;
  //     fixture.detectChanges();
  //   });
  //
  //   it('should not show the status span', () => {
  //     const statusField = fixture.debugElement.query(By.css('span.item-list-status'));
  //     expect(statusField).toBeNull();
  //   });
  // });
});

describe('ProjectSearchResultListElementComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectSearchResultListElementComponent, TruncatePipe],
      providers: [
        {provide: TruncatableService, useValue: {}},
        {provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
        {provide: NotificationsService, useValue: {}},
        {provide: TranslateService, useValue: {}},
        {provide: ResourcePolicyDataService, useValue: {}},
        {provide: AuthService, useValue: authService},
        {provide: EPersonDataService, useValue: epersonService},
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: DSONameService, useClass: DSONameServiceMock},
        { provide: APP_CONFIG, useValue: enviromentNoThumbs }

      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ProjectSearchResultListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ProjectSearchResultListElementComponent);
    projectListElementComponent = fixture.componentInstance;
  }));

  describe('with environment.browseBy.showThumbnails set to false', () => {
    beforeEach(() => {
      supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
        a: paginatedListRD
      }));
      projectListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should not add thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeFalsy();
    });
  });
});
