import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { NotifyInfoService } from '../../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { SignpostingLink } from '../../core/data/signposting-links.model';
import {
  LinkDefinition,
  LinkHeadService,
} from '../../core/services/link-head.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { Item } from '../../core/shared/item.model';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { ListableObjectComponentLoaderComponent } from '../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import {
  createFailedRemoteDataObject$,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { VarDirective } from '../../shared/utils/var.directive';
import { ThemedItemAlertsComponent } from '../alerts/themed-item-alerts.component';
import { ItemVersionsComponent } from '../versions/item-versions.component';
import { ItemVersionsNoticeComponent } from '../versions/notice/item-versions-notice.component';
import { ItemPageComponent } from './item-page.component';
import { createRelationshipsObservable } from './item-types/shared/item.component.spec';
import { NotifyRequestsStatusComponent } from './notify-requests-status/notify-requests-status-component/notify-requests-status.component';
import { QaEventNotificationComponent } from './qa-event-notification/qa-event-notification.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: [],
  relationships: createRelationshipsObservable(),
});

const mockWithdrawnItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: [],
  relationships: createRelationshipsObservable(),
  isWithdrawn: true,
});

const mocklink = {
  href: 'http://test.org',
  rel: 'rel1',
  type: 'type1',
};

const mocklink2 = {
  href: 'http://test2.org',
  rel: 'rel2',
  type: undefined,
};

const mockSignpostingLinks: SignpostingLink[] = [mocklink, mocklink2];

describe('ItemPageComponent', () => {
  let comp: ItemPageComponent;
  let fixture: ComponentFixture<ItemPageComponent>;
  let authorizationDataService: AuthorizationDataService;
  let serverResponseService: jasmine.SpyObj<ServerResponseService>;
  let signpostingDataService: jasmine.SpyObj<SignpostingDataService>;
  let linkHeadService: jasmine.SpyObj<LinkHeadService>;
  let notifyInfoService: jasmine.SpyObj<NotifyInfoService>;

  const mockRoute = Object.assign(new ActivatedRouteStub(), {
    data: of({ dso: createSuccessfulRemoteDataObject(mockItem) }),
  });

  const getCoarLdnLocalInboxUrls = ['http://InboxUrls.org', 'http://InboxUrls2.org'];

  beforeEach(waitForAsync(() => {
    authorizationDataService = jasmine.createSpyObj('authorizationDataService', {
      isAuthorized: of(false),
    });
    serverResponseService = jasmine.createSpyObj('ServerResponseService', {
      setHeader: jasmine.createSpy('setHeader'),
    });

    signpostingDataService = jasmine.createSpyObj('SignpostingDataService', {
      getLinks: of([mocklink, mocklink2]),
    });

    linkHeadService = jasmine.createSpyObj('LinkHeadService', {
      addTag: jasmine.createSpy('setHeader'),
      removeTag: jasmine.createSpy('removeTag'),
    });

    notifyInfoService = jasmine.createSpyObj('NotifyInfoService', {
      getInboxRelationLink: 'http://www.w3.org/ns/ldp#inbox',
      isCoarConfigEnabled: of(true),
      getCoarLdnLocalInboxUrls: of(getCoarLdnLocalInboxUrls),
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, ItemPageComponent, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ItemDataService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: ServerResponseService, useValue: serverResponseService },
        { provide: SignpostingDataService, useValue: signpostingDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: NotifyInfoService, useValue: notifyInfoService },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemPageComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: { imports: [
        ThemedItemAlertsComponent,
        ItemVersionsNoticeComponent,
        ListableObjectComponentLoaderComponent,
        ItemVersionsComponent,
        ErrorComponent,
        ThemedLoadingComponent,
        NotifyRequestsStatusComponent,
        QaEventNotificationComponent,
      ] },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('when the item is loading', () => {
    beforeEach(() => {
      comp.itemRD$ = createPendingRemoteDataObject$();
      // comp.itemRD$ = observableOf(new RemoteData(true, true, true, null, undefined));
      fixture.detectChanges();
    });

    it('should display a loading component', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading.nativeElement).toBeDefined();
    });
  });

  describe('when the item failed loading', () => {
    beforeEach(() => {
      comp.itemRD$ = createFailedRemoteDataObject$('server error', 500);
      fixture.detectChanges();
    });

    it('should display an error component', () => {
      const error = fixture.debugElement.query(By.css('ds-error'));
      expect(error.nativeElement).toBeDefined();
    });
  });

  describe('when the item is withdrawn and the user is an admin', () => {
    beforeEach(() => {
      comp.isAdmin$ = of(true);
      comp.itemRD$ = createSuccessfulRemoteDataObject$(mockWithdrawnItem);
      fixture.detectChanges();
    });

    it('should display the item', () => {
      const objectLoader = fixture.debugElement.query(By.css('ds-listable-object-component-loader'));
      expect(objectLoader.nativeElement).toBeDefined();
    });

    it('should add the signposting links', () => {
      expect(serverResponseService.setHeader).toHaveBeenCalled();
      expect(linkHeadService.addTag).toHaveBeenCalledTimes(4);
    });


    it('should add link tags correctly', () => {

      expect(comp.signpostingLinks).toEqual([mocklink, mocklink2]);

      // Check if linkHeadService.addTag() was called with the correct arguments
      expect(linkHeadService.addTag).toHaveBeenCalledTimes(mockSignpostingLinks.length + getCoarLdnLocalInboxUrls.length);
      let expected: LinkDefinition = mockSignpostingLinks[0] as LinkDefinition;
      expect(linkHeadService.addTag).toHaveBeenCalledWith(expected);
      expected = {
        href: 'http://test2.org',
        rel: 'rel2',
      };
      expect(linkHeadService.addTag).toHaveBeenCalledWith(expected);
    });

    it('should set Link header on the server', () => {
      expect(serverResponseService.setHeader).toHaveBeenCalledWith('Link', '<http://test.org> ; rel="rel1" ; type="type1" , <http://test2.org> ; rel="rel2" , <http://InboxUrls.org> ; rel="http://www.w3.org/ns/ldp#inbox", <http://InboxUrls2.org> ; rel="http://www.w3.org/ns/ldp#inbox"');
    });

  });
  describe('when the item is withdrawn and the user is not an admin', () => {
    beforeEach(() => {
      comp.itemRD$ = createSuccessfulRemoteDataObject$(mockWithdrawnItem);
      fixture.detectChanges();
    });

    it('should not display the item', () => {
      const objectLoader = fixture.debugElement.query(By.css('ds-listable-object-component-loader'));
      expect(objectLoader).toBeNull();
    });
  });

  describe('when the item is not withdrawn and the user is an admin', () => {
    beforeEach(() => {
      comp.isAdmin$ = of(true);
      comp.itemRD$ = createSuccessfulRemoteDataObject$(mockItem);
      fixture.detectChanges();
    });

    it('should display the item', () => {
      const objectLoader = fixture.debugElement.query(By.css('ds-listable-object-component-loader'));
      expect(objectLoader.nativeElement).toBeDefined();
    });

    it('should add the signposting links', () => {
      expect(serverResponseService.setHeader).toHaveBeenCalled();
      expect(linkHeadService.addTag).toHaveBeenCalledTimes(4);
    });
  });

  describe('when the item is not withdrawn and the user is not an admin', () => {
    beforeEach(() => {
      comp.itemRD$ = createSuccessfulRemoteDataObject$(mockItem);
      fixture.detectChanges();
    });

    it('should display the item', () => {
      const objectLoader = fixture.debugElement.query(By.css('ds-listable-object-component-loader'));
      expect(objectLoader.nativeElement).toBeDefined();
    });

    it('should add the signposting links', () => {
      expect(serverResponseService.setHeader).toHaveBeenCalled();
      expect(linkHeadService.addTag).toHaveBeenCalledTimes(4);
    });
  });

});
