import { KeyValuePipe } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  of as observableOf,
} from 'rxjs';

import { getForbiddenRoute } from '../../app-routing-paths';
import { AuthService } from '../../core/auth/auth.service';
import { NotifyInfoService } from '../../core/coar-notify/notify-info/notify-info.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { ItemRequestDataService } from '../../core/data/item-request-data.service';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { Item } from '../../core/shared/item.model';
import { ItemRequest } from '../../core/shared/item-request.model';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { ItemAccessByTokenPageComponent } from './item-access-by-token-page.component';
import { ItemAccessByTokenViewComponent } from './item-access-by-token-view.component';

describe('ItemAccessByTokenPageComponent', () => {
  let component: ItemAccessByTokenPageComponent;
  let fixture: ComponentFixture<ItemAccessByTokenPageComponent>;
  let itemRequestService: jasmine.SpyObj<ItemRequestDataService>;
  let router: jasmine.SpyObj<Router>;
  let authorizationService: AuthorizationDataService;
  authorizationService = jasmine.createSpyObj('authorizationService', {
    isAuthorized: observableOf(false),
  });
  let signpostingDataService: SignpostingDataService;

  const mocklink = {
    href: 'http://test.org',
    rel: 'test',
    type: 'test',
  };

  const mocklink2 = {
    href: 'http://test2.org',
    rel: 'test',
    type: 'test',
  };
  signpostingDataService = jasmine.createSpyObj('SignpostingDataService', {
    getLinks: observableOf([mocklink, mocklink2]),
  });
  const linkHeadService = jasmine.createSpyObj('linkHeadService', {
    addTag: '',
  });

  const mockItem = Object.assign(new Item(), {
    uuid: 'test-item-uuid',
    id: 'test-item-id',
    metadata: {
      'dspace.entity.type': [{
        value: 'Publication',
        language: 'en',
        place: 0,
        authority: null,
        confidence: -1,
      }],
    },
    _links: {
      self: { href: 'obj-selflink' },
    },
  });

  const mockItemRequest = Object.assign(new ItemRequest(), {
    token: 'valid-token',
    accessToken: 'valid-token',
    itemId: mockItem.uuid,
  });

  const queryParams = { accessToken: 'valid-token' };
  const mockActivatedRoute = {
    queryParams: new BehaviorSubject(queryParams),
    data: observableOf({
      dso: createSuccessfulRemoteDataObject(mockItem),
    }),
    params: observableOf({ itemId: mockItem.uuid, queryParams: [ { accessToken: 'valid-token' } ] }),
    children: [],
  };
  itemRequestService = jasmine.createSpyObj('ItemRequestDataService', {
    getSanitizedRequestByAccessToken: observableOf(createSuccessfulRemoteDataObject(mockItemRequest)),
  });
  router = jasmine.createSpyObj('Router', ['navigateByUrl'], {
    events: observableOf([]),
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        KeyValuePipe,
      ],
      providers: [
        { provide: ItemRequestDataService, useValue: itemRequestService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ItemDataService, useValue: {} },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ServerResponseService, useValue: {} },
        { provide: SignpostingDataService, useValue: signpostingDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: NotifyInfoService, useValue: { isCoarConfigEnabled: () => observableOf(false) } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        KeyValuePipe,
        {
          provide: Store,
          useValue: {
            pipe: () => observableOf({}),
            dispatch: () => {
            },
            select: () => observableOf({}),
          },
        },
        {
          provide: AuthService, useValue: {
            isAuthenticated: () => observableOf(true),
          },
        },
      ],
    }).overrideComponent(ItemAccessByTokenPageComponent, {
      set: {
        template: '<div></div>',
      },
    }).overrideComponent(ItemAccessByTokenViewComponent, {
      set: {
        template: '<div></div>',
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAccessByTokenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  /**
   * Tests in this component are concerned only with successful access token processing (or error handling)
   * and a resulting item request object. Testing of template elements is out of scope and left for child components.
   */
  describe('ngOnInit - basic component testing', () => {
    it('should find valid access token and sanitize it', fakeAsync(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          KeyValuePipe,
          RouterTestingModule.withRoutes([]),
        ],
        providers: [
          { provide: ItemRequestDataService, useValue: itemRequestService },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AuthService, useValue: {} },
          { provide: ItemDataService, useValue: {} },
          { provide: AuthorizationDataService, useValue: authorizationService },
          { provide: ServerResponseService, useValue: {} },
          { provide: SignpostingDataService, useValue: signpostingDataService },
          { provide: LinkHeadService, useValue: linkHeadService },
          { provide: NotifyInfoService, useValue: { isCoarConfigEnabled: () => observableOf(false) } },
          { provide: PLATFORM_ID, useValue: 'browser' },
          KeyValuePipe,
          {
            provide: Store,
            useValue: {
              pipe: () => observableOf({}),
              dispatch: () => {},
              select: () => observableOf({}),
            },
          },
          { provide: AuthService, useValue: {
            isAuthenticated: () => observableOf(false ) },
          },
        ],
      }).overrideComponent(ItemAccessByTokenViewComponent, {
        set: { template: '<div></div>' } } ).compileComponents();

      fixture = TestBed.createComponent(ItemAccessByTokenPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(itemRequestService.getSanitizedRequestByAccessToken).toHaveBeenCalledWith('valid-token');

    }));

    it('should process valid access token and load item request', fakeAsync(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          KeyValuePipe,
          RouterTestingModule.withRoutes([]),
        ],
        providers: [
          { provide: ItemRequestDataService, useValue: itemRequestService },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: AuthService, useValue: {} },
          { provide: ItemDataService, useValue: {} },
          { provide: AuthorizationDataService, useValue: authorizationService },
          { provide: ServerResponseService, useValue: {} },
          { provide: SignpostingDataService, useValue: signpostingDataService },
          { provide: LinkHeadService, useValue: linkHeadService },
          { provide: NotifyInfoService, useValue: { isCoarConfigEnabled: () => observableOf(false) } },
          { provide: PLATFORM_ID, useValue: 'browser' },
          KeyValuePipe,
          {
            provide: Store,
            useValue: {
              pipe: () => observableOf({}),
              dispatch: () => {},
              select: () => observableOf({}),
            },
          },
          { provide: AuthService, useValue: {
            isAuthenticated: () => observableOf(false ) },
          },
        ],
      }).overrideComponent(ItemAccessByTokenViewComponent, {
        set: { template: '<div></div>' } } ).compileComponents();

      fixture = TestBed.createComponent(ItemAccessByTokenPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.itemRequest$.subscribe((request) => {
        expect(request).toBeTruthy();
      });
    }));

    it('should redirect to forbidden route when access token is missing', fakeAsync(() => {
      const routeWithoutToken = {
        queryParams: observableOf({}),
        data: observableOf({
          dso: createSuccessfulRemoteDataObject(mockItem),
        }),
        params: observableOf({ itemId: mockItem.uuid }),
        children: [],
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot(),
          KeyValuePipe,
        ],
        providers: [
          { provide: ItemRequestDataService, useValue: itemRequestService },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useValue: routeWithoutToken },
          { provide: AuthService, useValue: {} },
          { provide: ItemDataService, useValue: {} },
          { provide: AuthorizationDataService, useValue: authorizationService },
          { provide: ServerResponseService, useValue: {} },
          { provide: SignpostingDataService, useValue: signpostingDataService },
          { provide: LinkHeadService, useValue: linkHeadService },
          { provide: NotifyInfoService, useValue: { isCoarConfigEnabled: () => observableOf(false) } },
          { provide: PLATFORM_ID, useValue: 'browser' },
          {
            provide: Store,
            useValue: {
              pipe: () => observableOf({}),
              dispatch: () => {},
              select: () => observableOf({}),
            },
          },
          { provide: AuthService, useValue: {
            isAuthenticated: () => observableOf(false ) },
          },
        ],
      }).overrideComponent(ItemAccessByTokenViewComponent, {
        set: {
          template: '<div></div>',
        } })
        .compileComponents();

      fixture = TestBed.createComponent(ItemAccessByTokenPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(router.navigateByUrl).toHaveBeenCalledWith(getForbiddenRoute(), { skipLocationChange: false });
    }));
  });
});

