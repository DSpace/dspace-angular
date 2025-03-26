import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FileService } from '../core/shared/file.service';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { Bitstream } from '../core/shared/bitstream.model';
import { getForbiddenRoute } from '../app-routing-paths';
import { SignpostingDataService } from '../core/data/signposting-data.service';
import { ServerResponseService } from '../core/services/server-response.service';
import { PLATFORM_ID } from '@angular/core';
import { NativeWindowRef, NativeWindowService } from '../core/services/window.service';
import { bitstreamDownloadRedirectGuard } from './bitstream-download-redirect.guard';
import { ObjectCacheService } from '../core/cache/object-cache.service';
import { UUIDService } from '../core/shared/uuid.service';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../core/cache/builders/remote-data-build.service';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { DSOChangeAnalyzer } from '../core/data/dso-change-analyzer.service';
import { BitstreamFormatDataService } from '../core/data/bitstream-format-data.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { BitstreamDataService } from '../core/data/bitstream-data.service';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';

describe('BitstreamDownloadRedirectGuard', () => {
  let resolver: any;

  let authService: AuthService;
  let authorizationService: AuthorizationDataService;
  let bitstreamDataService: BitstreamDataService;
  let fileService: FileService;
  let halEndpointService: HALEndpointService;
  let hardRedirectService: HardRedirectService;
  let remoteDataBuildService: RemoteDataBuildService;
  let uuidService: UUIDService;
  let objectCacheService: ObjectCacheService;
  let router: Router;
  let store: Store;
  let bitstream: Bitstream;
  let serverResponseService: jasmine.SpyObj<ServerResponseService>;
  let signpostingDataService: jasmine.SpyObj<SignpostingDataService>;

  let route = {
    params: {},
    queryParams: {}
  };
  let state = {};

  const mocklink = {
    href: 'http://test.org',
    rel: 'test',
    type: 'test'
  };

  const mocklink2 = {
    href: 'http://test2.org',
    rel: 'test',
    type: 'test'
  };

  function init() {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: observableOf(true),
      setRedirectUrl: {}
    });
    authorizationService = jasmine.createSpyObj('authorizationSerivice', {
      isAuthorized: observableOf(true)
    });

    fileService = jasmine.createSpyObj('fileService', {
      retrieveFileDownloadLink: observableOf('content-url-with-headers')
    });

    hardRedirectService = jasmine.createSpyObj('fileService', {
      redirect: {}
    });

    halEndpointService = jasmine.createSpyObj('halEndpointService', {
      getEndpoint: observableOf('https://rest.api/core')
    });

    remoteDataBuildService = jasmine.createSpyObj('remoteDataBuildService', {
      buildSingle: observableOf(new Bitstream())
    });

    uuidService = jasmine.createSpyObj('uuidService', {
      generate: 'test-id'
    });

    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
      _links: {
        content: {href: 'bitstream-content-link'},
        self: {href: 'bitstream-self-link'},
      }
    });

    router = jasmine.createSpyObj('router', ['navigateByUrl', 'createUrlTree']);

    store = jasmine.createSpyObj('store', {
      dispatch: {},
      pipe: observableOf(true)
    });

    serverResponseService = jasmine.createSpyObj('ServerResponseService', {
      setHeader: jasmine.createSpy('setHeader'),
    });

    signpostingDataService = jasmine.createSpyObj('SignpostingDataService', {
      getLinks: observableOf([mocklink, mocklink2])
    });

    objectCacheService = jasmine.createSpyObj('objectCacheService', {
      getByHref: observableOf(null)
    });

    bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
      findById: createSuccessfulRemoteDataObject$(Object.assign(new Bitstream(), {
        _links: {
          content: {href: 'bitstream-content-link'},
          self: {href: 'bitstream-self-link'},
        },
      }))
    });

    resolver = bitstreamDownloadRedirectGuard;
  }

  function initTestbed() {
    TestBed.configureTestingModule({
      providers: [
        {provide: NativeWindowService, useValue: new NativeWindowRef()},
        {provide: Router, useValue: router},
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: AuthService, useValue: authService},
        {provide: FileService, useValue: fileService},
        {provide: HardRedirectService, useValue: hardRedirectService},
        {provide: ServerResponseService, useValue: serverResponseService},
        {provide: SignpostingDataService, useValue: signpostingDataService},
        {provide: ObjectCacheService, useValue: objectCacheService},
        {provide: PLATFORM_ID, useValue: 'server'},
        {provide: UUIDService, useValue: uuidService},
        {provide: Store, useValue: store},
        {provide: RemoteDataBuildService, useValue: remoteDataBuildService},
        {provide: HALEndpointService, useValue: halEndpointService},
        {provide: DSOChangeAnalyzer, useValue: {}},
        {provide: BitstreamFormatDataService, useValue: {}},
        {provide: NotificationsService, useValue: {}},
        {provide: BitstreamDataService, useValue: bitstreamDataService},
      ]
    });
  }

  describe('bitstream retrieval', () => {
    describe('when the user is authorized and not logged in', () => {
      beforeEach(() => {
        init();
        (authService.isAuthenticated as jasmine.Spy).and.returnValue(observableOf(false));
        initTestbed();
      });
      it('should redirect to the content link', waitForAsync(() => {
        TestBed.runInInjectionContext(() => {
          resolver(route, state).subscribe(() => {
              expect(hardRedirectService.redirect).toHaveBeenCalledWith('bitstream-content-link');
            }
          );
        });
      }));
    });
    describe('when the user is authorized and logged in', () => {
      beforeEach(() => {
        init();
        initTestbed();
      });
      it('should redirect to an updated content link', waitForAsync(() => {
        TestBed.runInInjectionContext(() => {
          resolver(route, state).subscribe(() => {
            expect(hardRedirectService.redirect).toHaveBeenCalledWith('content-url-with-headers');
          });
        });
      }));
    });
    describe('when the user is not authorized and logged in', () => {
      beforeEach(() => {
        init();
        (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(false));
        initTestbed();
      });
      it('should navigate to the forbidden route', waitForAsync(() => {
        TestBed.runInInjectionContext(() => {
          resolver(route, state).subscribe(() => {
            expect(router.createUrlTree).toHaveBeenCalledWith([getForbiddenRoute()]);
          });
        });
      }));
    });
    describe('when the user is not authorized and not logged in', () => {
      beforeEach(() => {
        init();
        (authService.isAuthenticated as jasmine.Spy).and.returnValue(observableOf(false));
        (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(false));
        initTestbed();
      });
      it('should navigate to the login page', waitForAsync(() => {

        TestBed.runInInjectionContext(() => {
          resolver(route, state).subscribe(() => {
            expect(authService.setRedirectUrl).toHaveBeenCalled();
            expect(router.createUrlTree).toHaveBeenCalledWith(['login']);
          });
        });
      }));
    });
  });
});
