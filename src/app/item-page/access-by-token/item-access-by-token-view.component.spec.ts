import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  of as observableOf,
  of,
} from 'rxjs';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ItemRequestDataService } from '../../core/data/item-request-data.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { Item } from '../../core/shared/item.model';
import { ItemRequest } from '../../core/shared/item-request.model';
import { ITEM_REQUEST } from '../../core/shared/item-request.resource-type';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { ThemedResultsBackButtonComponent } from '../../shared/results-back-button/themed-results-back-button.component';
import { RouterLinkDirectiveStub } from '../../shared/testing/router-link-directive.stub';
import { ViewTrackerComponent } from '../../statistics/angulartics/dspace/view-tracker.component';
import { ThemedItemAlertsComponent } from '../alerts/themed-item-alerts.component';
import { CollectionsComponent } from '../field-components/collections/collections.component';
import { ThemedFullFileSectionComponent } from '../full/field-components/file-section/themed-full-file-section.component';
import { ThemedMediaViewerComponent } from '../media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../mirador-viewer/mirador-viewer.component';
import { ThemedFileSectionComponent } from '../simple/field-components/file-section/themed-file-section.component';
import { ThemedMetadataRepresentationListComponent } from '../simple/metadata-representation-list/themed-metadata-representation-list.component';
import { ItemVersionsComponent } from '../versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../versions/notice/item-versions-notice.component';
import { ItemSecureFileDownloadLinkComponent } from './field-components/file-download-link/item-secure-file-download-link.component';
import { ItemSecureFileSectionComponent } from './field-components/file-section/item-secure-file-section.component';
import { ItemSecureMediaViewerComponent } from './field-components/media-viewer/item-secure-media-viewer.component';
import { ItemAccessByTokenViewComponent } from './item-access-by-token-view.component';


describe('ItemAccessByTokenViewComponent', () => {
  let authorizationService: AuthorizationDataService;
  let itemRequestDataService: ItemRequestDataService;
  let bitstream: Bitstream;
  let item: Item;
  let itemRequest: ItemRequest;
  let component: ItemAccessByTokenViewComponent;
  let fixture: ComponentFixture<ItemAccessByTokenViewComponent>;
  let routeStub: any;

  function init() {
    itemRequestDataService = jasmine.createSpyObj('itemRequestDataService', {
      canDownload: observableOf(true),
    });
    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
    });
    item = Object.assign(new Item(), {
      uuid: 'itemUuid',
      metadata: {
        'dspace.entity.type': [
          {
            value: 'Publication',
          },
        ],
      },
      _links: {
        self: { href: 'obj-selflink' },
      },
    });
    routeStub = {
      data: observableOf({
        dso: createSuccessfulRemoteDataObject(item),
      }),
      children: [],
    };

    const mockItemRequest: ItemRequest = Object.assign(new ItemRequest(), {

    });
    itemRequest = Object.assign(new ItemRequest(),
      {
        itemId: item.uuid,
        bitstreamId: bitstream.uuid,
        allfiles: false,
        requestEmail: 'user@name.org',
        requestName: 'User Name',
        requestMessage: 'I would like to request a copy',
        accessPeriod: 3600,
        decisionDate: new Date().toISOString(),
        token: 'test-token',
        type: ITEM_REQUEST,
        requestDate: new Date().toISOString(),
        accessToken: 'test-token',
        expires: null,
        acceptRequest: true,
      });
  }

  function initTestbed() {

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(), ItemSecureFileDownloadLinkComponent,
        RouterLinkDirectiveStub,
      ],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: RouterLinkDirectiveStub },
        { provide: ItemRequestDataService, useValue: itemRequestDataService },
        provideMockStore(),
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemAccessByTokenViewComponent, {
      remove: {
        imports: [
          ErrorComponent,
          ThemedLoadingComponent,
          ThemedFullFileSectionComponent,
          CollectionsComponent,
          ItemVersionsComponent,
          DsoEditMenuComponent,
          ItemVersionsNoticeComponent,
          ViewTrackerComponent,
          ThemedItemAlertsComponent,
          ItemSecureFileSectionComponent,
          MiradorViewerComponent,
          ThemedFileSectionComponent,
          ThemedMediaViewerComponent,
          ThemedMetadataRepresentationListComponent,
          ThemedResultsBackButtonComponent,
          ItemSecureMediaViewerComponent,
        ],
      },
    }).compileComponents();
  }

  const mockItem = Object.assign(new Item(), {
    uuid: 'test-item-uuid',
    id: 'test-item-id',
  });




  beforeEach(waitForAsync(() => {
    init();
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true),
    });
    initTestbed();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAccessByTokenViewComponent);
    component = fixture.componentInstance;
    component.object = item;
    component.itemRequest$ = of(itemRequest);
    component.itemRequestSubject.next(itemRequest);
    fixture.detectChanges();
  });

  describe('Component and inputs initialised properly', () => {
    it('should initialize with valid ItemRequest input', () => {
      //component.itemRequestSubject.next(itemRequest);
      component.itemRequest$.subscribe(request => {
        expect(request).toBeDefined();
        expect(request.accessPeriod).toBe(3600);
        expect(request.token).toBe('test-token');
        expect(request.requestName).toBe('User Name');
        expect(request.requestEmail).toBe('user@name.org');
        expect(request.requestMessage).toBe('I would like to request a copy');
        expect(request.allfiles).toBe(false);
        expect(request.bitstreamId).toBe(bitstream.uuid);
        expect(request.acceptRequest).toBe(true);
      });
    });
  });

  describe('getAccessPeriodEndDate', () => {
    it('should calculate correct end date based on decision date and access period', () => {
      const testDecisionDate = '2024-01-01T00:00:00Z';
      const testAccessPeriod = 3600;

      const testRequest = {
        ...itemRequest,
        decisionDate: testDecisionDate,
        accessPeriod: testAccessPeriod,
      };
      component.itemRequest$ = of(testRequest);
      component.itemRequestSubject.next(testRequest);
      const expectedDate = new Date(testDecisionDate);
      expectedDate.setUTCSeconds(expectedDate.getUTCSeconds() + testAccessPeriod);

      expect(component.getAccessPeriodEndDate()).toEqual(expectedDate);
    });

    it('should return undefined when access period is 0', () => {
      component.itemRequestSubject.next({ ...itemRequest, accessPeriod: 0 });
      expect(component.getAccessPeriodEndDate()).toBeUndefined();
    });
  });
});

