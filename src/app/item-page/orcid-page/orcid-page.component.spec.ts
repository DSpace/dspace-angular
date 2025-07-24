import {
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { AuthService } from '../../core/auth/auth.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { OrcidAuthService } from '../../core/orcid/orcid-auth.service';
import { OrcidHistoryDataService } from '../../core/orcid/orcid-history-data.service';
import { OrcidQueueDataService } from '../../core/orcid/orcid-queue-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { ResearcherProfile } from '../../core/profile/model/researcher-profile.model';
import { ResearcherProfileDataService } from '../../core/profile/researcher-profile-data.service';
import { Item } from '../../core/shared/item.model';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { OrcidPageComponent } from './orcid-page.component';

describe('OrcidPageComponent test suite', () => {
  let comp: OrcidPageComponent;
  let fixture: ComponentFixture<OrcidPageComponent>;
  let scheduler: TestScheduler;
  let authService: jasmine.SpyObj<AuthService>;
  let routeStub: jasmine.SpyObj<ActivatedRouteStub>;
  let routeData: any;
  let itemDataService: jasmine.SpyObj<ItemDataService>;
  let researcherProfileDataService: jasmine.SpyObj<ResearcherProfileDataService>;
  let orcidAuthService: jasmine.SpyObj<OrcidAuthService>;
  let orcidQueueDataService: jasmine.SpyObj<OrcidQueueDataService>;
  let orcidHistoryDataService: jasmine.SpyObj<OrcidHistoryDataService>;

  const mockResearcherProfile: ResearcherProfile = Object.assign(new ResearcherProfile(), {
    id: 'test-id',
    visible: true,
    type: 'profile',
    _links: {
      item: {
        href: 'https://rest.api/rest/api/profiles/test-id/item',
      },
      self: {
        href: 'https://rest.api/rest/api/profiles/test-id',
      },
    },
  });
  const mockItem: Item = Object.assign(new Item(), {
    id: 'test-id',
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'test item',
        },
      ],
    },
  });
  const mockItemLinkedToOrcid: Item = Object.assign(new Item(), {
    id: 'test-id',
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: {
      'dc.title': [
        {
          value: 'test item',
        },
      ],
      'dspace.orcid.authenticated': [
        {
          value: 'true',
        },
      ],
    },
  });

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: jasmine.createSpy('isAuthenticated'),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
    });

    routeData = {
      dso: createSuccessfulRemoteDataObject(mockItem),
    };

    routeStub = new ActivatedRouteStub({}, routeData);

    orcidAuthService = jasmine.createSpyObj('OrcidAuthService', {
      isLinkedToOrcid: jasmine.createSpy('isLinkedToOrcid'),
      linkOrcidByItem: jasmine.createSpy('linkOrcidByItem'),
      getOrcidAuthorizationScopes: of([]),
      getOrcidAuthorizationScopesByItem: of([]),
      onlyAdminCanDisconnectProfileFromOrcid: of(false),
      ownerCanDisconnectProfileFromOrcid: of(false),
    });

    researcherProfileDataService = jasmine.createSpyObj('ResearcherProfileDataService', {
      findById: createSuccessfulRemoteDataObject$(mockResearcherProfile),
    });

    orcidQueueDataService = jasmine.createSpyObj('OrcidQueueDataService', {
      searchByProfileItemId: createSuccessfulRemoteDataObject$(createPaginatedList([])),
      clearFindByProfileItemRequests: jasmine.createSpy('clearFindByProfileItemRequests'),
    });

    orcidHistoryDataService = jasmine.createSpyObj('OrcidHistoryDataService', {
      sendToORCID: createSuccessfulRemoteDataObject$(mockItem),
    });

    itemDataService = jasmine.createSpyObj('ItemDataService', {
      findById: jasmine.createSpy('findById'),
    });

    void TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        RouterTestingModule.withRoutes([]),
        OrcidPageComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: OrcidAuthService, useValue: orcidAuthService },
        { provide: ResearcherProfileDataService, useValue: researcherProfileDataService },
        { provide: OrcidQueueDataService, useValue: orcidQueueDataService },
        { provide: OrcidHistoryDataService, useValue: orcidHistoryDataService },
        { provide: AuthService, useValue: authService },
        { provide: PaginationService, useValue: new PaginationServiceStub() },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(OrcidPageComponent);
    comp = fixture.componentInstance;
    authService.isAuthenticated.and.returnValue(of(true));
  }));

  describe('whn has no query param', () => {
    beforeEach(waitForAsync(() => {
      fixture.detectChanges();
    }));

    it('should create', () => {
      const btn = fixture.debugElement.queryAll(By.css('[data-test="back-button"]'));
      const auth = fixture.debugElement.query(By.css('[data-test="orcid-auth"]'));
      const settings = fixture.debugElement.query(By.css('[data-test="orcid-sync-setting"]'));
      expect(comp).toBeTruthy();
      expect(btn.length).toBe(1);
      expect(auth).toBeTruthy();
      expect(settings).toBeTruthy();
      expect(comp.itemId).toBe('test-id');
    });

    it('should call isLinkedToOrcid', () => {
      comp.isLinkedToOrcid();

      expect(orcidAuthService.isLinkedToOrcid).toHaveBeenCalledWith(comp.item.value);
    });

    it('should update item', fakeAsync(() => {
      itemDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockItemLinkedToOrcid));
      scheduler.schedule(() => comp.updateItem());
      scheduler.flush();

      expect(comp.item.value).toEqual(mockItemLinkedToOrcid);
    }));
  });

  describe('when query param contains orcid code', () => {
    beforeEach(waitForAsync(() => {
      spyOn(comp, 'updateItem').and.callThrough();
      routeStub.testParams = {
        code: 'orcid-code',
      };
    }));

    describe('and linking to orcid profile is successfully', () => {
      beforeEach(waitForAsync(() => {
        orcidAuthService.linkOrcidByItem.and.returnValue(createSuccessfulRemoteDataObject$(mockResearcherProfile));
        itemDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockItemLinkedToOrcid));
        fixture.detectChanges();
      }));

      it('should call linkOrcidByItem', () => {
        expect(orcidAuthService.linkOrcidByItem).toHaveBeenCalledWith(mockItem, 'orcid-code');
        expect(comp.updateItem).toHaveBeenCalled();
      });

      it('should create', () => {
        const btn = fixture.debugElement.queryAll(By.css('[data-test="back-button"]'));
        const auth = fixture.debugElement.query(By.css('[data-test="orcid-auth"]'));
        const settings = fixture.debugElement.query(By.css('[data-test="orcid-sync-setting"]'));
        expect(comp).toBeTruthy();
        expect(btn.length).toBe(1);
        expect(auth).toBeTruthy();
        expect(settings).toBeTruthy();
        expect(comp.itemId).toBe('test-id');
      });

    });

    describe('and linking to orcid profile is failed', () => {
      beforeEach(waitForAsync(() => {
        orcidAuthService.linkOrcidByItem.and.returnValue(createFailedRemoteDataObject$());
        itemDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockItemLinkedToOrcid));
        fixture.detectChanges();
      }));

      it('should call linkOrcidByItem', () => {
        expect(orcidAuthService.linkOrcidByItem).toHaveBeenCalledWith(mockItem, 'orcid-code');
        expect(comp.updateItem).not.toHaveBeenCalled();
      });

      it('should create', () => {
        const btn = fixture.debugElement.queryAll(By.css('[data-test="back-button"]'));
        const auth = fixture.debugElement.query(By.css('[data-test="orcid-auth"]'));
        const settings = fixture.debugElement.query(By.css('[data-test="orcid-sync-setting"]'));
        const error = fixture.debugElement.query(By.css('[data-test="error-box"]'));
        expect(comp).toBeTruthy();
        expect(btn.length).toBe(1);
        expect(error).toBeTruthy();
        expect(auth).toBeFalsy();
        expect(settings).toBeFalsy();
      });

    });
  });
});
