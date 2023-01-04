import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of as observableOf, of } from 'rxjs';
import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../../utils/truncate.pipe';
import { TruncatableService } from '../../../../../truncatable/truncatable.service';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock, UNDEFINED_NAME } from '../../../../../mocks/dso-name.service.mock';
import { APP_CONFIG } from '../../../../../../../config/app-config.interface';
import { SupervisionOrderDataService } from '../../../../../../core/supervision-order/supervision-order-data.service';
import { NotificationsService } from '../../../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../../../../shared/remote-data.utils';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { buildPaginatedList } from '../../../../../../core/data/paginated-list.model';
import { GroupMock } from '../../../../../../shared/testing/group-mock';
import { hot } from 'jasmine-marbles';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { AuthorizationDataService } from '../../../../../../core/data/feature-authorization/authorization-data.service';
import { EPersonDataService } from '../../../../../../core/eperson/eperson-data.service';
import { ResourcePolicyDataService } from '../../../../../../core/resource-policy/resource-policy-data.service';
import { AuthServiceStub } from '../../../../../../shared/testing/auth-service.stub';
import { EPersonMock } from '../../../../../../shared/testing/eperson.mock';
import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { createPaginatedList } from 'src/app/shared/testing/utils.test';

let publicationListElementComponent: ItemSearchResultListElementComponent;
let fixture: ComponentFixture<ItemSearchResultListElementComponent>;
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

const mockItemWithMetadata: ItemSearchResult = Object.assign(new ItemSearchResult(), {
  indexableObject:
    Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {
        'dc.title': [
          {
            language: 'en_US',
            value: 'This is just another title'
          }
        ],
        'dc.contributor.author': [
          {
            language: 'en_US',
            value: 'Smith, Donald'
          }
        ],
        'dc.publisher': [
          {
            language: 'en_US',
            value: 'a publisher'
          }
        ],
        'dc.date.issued': [
          {
            language: 'en_US',
            value: '2015-06-26'
          }
        ],
        'dc.description.abstract': [
          {
            language: 'en_US',
            value: 'This is the abstract'
          }
        ]
      }
    })
});
const mockItemWithoutMetadata: ItemSearchResult = Object.assign(new ItemSearchResult(), {
  indexableObject:
    Object.assign(new Item(), {
      bundles: observableOf({}),
      metadata: {}
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

describe('ItemSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemSearchResultListElementComponent, TruncatePipe],
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
    }).overrideComponent(ItemSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
      a: paginatedListRD
    }));
    fixture = TestBed.createComponent(ItemSearchResultListElementComponent);
    publicationListElementComponent = fixture.componentInstance;

  }));

  describe('with environment.browseBy.showThumbnails set to true', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });
    it('should set showThumbnails to true', () => {
      expect(publicationListElementComponent.showThumbnails).toBeTrue();
    });

    it('should add ds-thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeTruthy();
    });
  });

  describe('When the item has an author', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).not.toBeNull();
    });
  });

  describe('When the item has no author', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the author paragraph', () => {
      const itemAuthorField = fixture.debugElement.query(By.css('span.item-list-authors'));
      expect(itemAuthorField).toBeNull();
    });
  });

  describe('When the item has a publisher', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the publisher span', () => {
      const publisherField = fixture.debugElement.query(By.css('span.item-list-publisher'));
      expect(publisherField).not.toBeNull();
    });
  });

  describe('When the item has no publisher', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the publisher span', () => {
      const publisherField = fixture.debugElement.query(By.css('span.item-list-publisher'));
      expect(publisherField).toBeNull();
    });
  });

  describe('When the item has an issuedate', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).not.toBeNull();
    });
  });

  describe('When the item has no issuedate', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the issuedate span', () => {
      const dateField = fixture.debugElement.query(By.css('span.item-list-date'));
      expect(dateField).toBeNull();
    });
  });

  describe('When the item has an abstract', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should show the abstract span', () => {
      const abstractField = fixture.debugElement.query(By.css('div.item-list-abstract'));
      expect(abstractField).not.toBeNull();
    });
  });

  describe('When the item has no abstract', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should not show the abstract span', () => {
      const abstractField = fixture.debugElement.query(By.css('div.item-list-abstract'));
      expect(abstractField).toBeNull();
    });
  });

  describe('When the item has no title', () => {
    beforeEach(() => {
      publicationListElementComponent.object = mockItemWithoutMetadata;
      fixture.detectChanges();
    });

    it('should show the fallback untitled translation', () => {
      const titleField = fixture.debugElement.query(By.css('.item-list-title'));
      expect(titleField.nativeElement.textContent.trim()).toEqual(UNDEFINED_NAME);
    });
  });
});

describe('ItemSearchResultListElementComponent', () => {

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ItemSearchResultListElementComponent, TruncatePipe],
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
    }).overrideComponent(ItemSearchResultListElementComponent, {
      set: {changeDetection: ChangeDetectionStrategy.Default}
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    supervisionOrderDataService.searchByItem.and.returnValue(hot('a|', {
      a: paginatedListRD
    }));
    fixture = TestBed.createComponent(ItemSearchResultListElementComponent);
    publicationListElementComponent = fixture.componentInstance;
  }));

  describe('with environment.browseBy.showThumbnails set to false', () => {
    beforeEach(() => {

      publicationListElementComponent.object = mockItemWithMetadata;
      fixture.detectChanges();
    });

    it('should not add ds-thumbnail element', () => {
      const thumbnailElement = fixture.debugElement.query(By.css('ds-thumbnail'));
      expect(thumbnailElement).toBeFalsy();
    });
  });
});
