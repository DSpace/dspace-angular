import {
  CommonModule,
  Location,
} from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { getForbiddenRoute } from '../../app-routing-paths';
import { AuthService } from '../../core/auth/auth.service';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { FileService } from '../../core/shared/file.service';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { MatomoService } from '../../statistics/matomo.service';
import { BitstreamDownloadPageComponent } from './bitstream-download-page.component';

describe('BitstreamDownloadPageComponent', () => {
  let component: BitstreamDownloadPageComponent;
  let fixture: ComponentFixture<BitstreamDownloadPageComponent>;

  let authService: AuthService;
  let fileService: FileService;
  let authorizationService: AuthorizationDataService;
  let hardRedirectService: HardRedirectService;
  let activatedRoute;
  let router;
  let location: Location;
  let dsoNameService: DSONameService;

  let bitstream: Bitstream;
  let serverResponseService: jasmine.SpyObj<ServerResponseService>;
  let signpostingDataService: jasmine.SpyObj<SignpostingDataService>;
  let matomoService: jasmine.SpyObj<MatomoService>;

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

  function init() {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
      setRedirectUrl: {},
      getShortlivedToken: of('token'),
    });
    authorizationService = jasmine.createSpyObj('authorizationSerivice', {
      isAuthorized: of(true),
    });

    fileService = jasmine.createSpyObj('fileService', {
      retrieveFileDownloadLink: of('content-url-with-headers'),
    });

    hardRedirectService = jasmine.createSpyObj('hardRedirectService', {
      redirect: {},
    });

    location = jasmine.createSpyObj('location', {
      back: {},
    });

    dsoNameService = jasmine.createSpyObj('dsoNameService', {
      getName: 'Test Bitstream',
    });

    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
      _links: {
        content: { href: 'bitstream-content-link' },
        self: { href: 'bitstream-self-link' },
      },
    });
    activatedRoute = {
      data: of({
        bitstream: createSuccessfulRemoteDataObject(bitstream),
      }),
      params: of({
        id: 'testid',
      }),
      queryParams: of({
        accessToken: undefined,
      }),
    };

    router = jasmine.createSpyObj('router', ['navigateByUrl']);

    serverResponseService = jasmine.createSpyObj('ServerResponseService', {
      setHeader: jasmine.createSpy('setHeader'),
    });

    signpostingDataService = jasmine.createSpyObj('SignpostingDataService', {
      getLinks: of([mocklink, mocklink2]),
    });
    matomoService = jasmine.createSpyObj('MatomoService', {
      appendVisitorId: of(''),
      isMatomoEnabled$: of(true),
    });
    matomoService.appendVisitorId.and.callFake((link) => of(link));
  }

  function initTestbed() {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), BitstreamDownloadPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: AuthService, useValue: authService },
        { provide: FileService, useValue: fileService },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: ServerResponseService, useValue: serverResponseService },
        { provide: SignpostingDataService, useValue: signpostingDataService },
        { provide: MatomoService, useValue: matomoService },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: Location, useValue: location },
        { provide: DSONameService, useValue: dsoNameService },
        { provide: ConfigurationDataService, useValue: {} },
      ],
    })
      .compileComponents();
  }

  describe('init', () => {
    beforeEach(waitForAsync(() => {
      init();
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(BitstreamDownloadPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should init the comp', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('bitstream retrieval', () => {
    describe('when the user is authorized and not logged in', () => {
      beforeEach(waitForAsync(() => {
        init();
        (authService.isAuthenticated as jasmine.Spy).and.returnValue(of(false));

        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamDownloadPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should redirect to the content link', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(hardRedirectService.redirect).toHaveBeenCalledWith('bitstream-content-link');
        });
      }));
      it('should add the signposting links', () => {
        expect(serverResponseService.setHeader).toHaveBeenCalled();
      });
    });
    describe('when the user is authorized and logged in', () => {
      beforeEach(waitForAsync(() => {
        init();
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamDownloadPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should redirect to an updated content link', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(hardRedirectService.redirect).toHaveBeenCalledWith('content-url-with-headers');
        });
      }));
    });
    describe('when the user is not authorized and logged in', () => {
      beforeEach(waitForAsync(() => {
        init();
        (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(of(false));
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamDownloadPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should navigate to the forbidden route', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(router.navigateByUrl).toHaveBeenCalledWith(getForbiddenRoute(), { skipLocationChange: true });
        });
      }));
    });
    describe('when the user is not authorized and not logged in', () => {
      beforeEach(waitForAsync(() => {
        init();
        (authService.isAuthenticated as jasmine.Spy).and.returnValue(of(false));
        (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(of(false));
        initTestbed();
      }));
      beforeEach(() => {
        fixture = TestBed.createComponent(BitstreamDownloadPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
      it('should navigate to the login page', waitForAsync(() => {
        fixture.whenStable().then(() => {
          expect(authService.setRedirectUrl).toHaveBeenCalled();
          expect(router.navigateByUrl).toHaveBeenCalledWith('login');
        });
      }));
    });
  });

  describe('when Matomo is enabled', () => {
    beforeEach(waitForAsync(() => {
      init();
      (matomoService.appendVisitorId as jasmine.Spy).and.callFake((link) => of(link + '?visitorId=12345'));
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(BitstreamDownloadPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should append visitor ID to the file link', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(matomoService.appendVisitorId).toHaveBeenCalledWith('content-url-with-headers');
        expect(hardRedirectService.redirect).toHaveBeenCalledWith('content-url-with-headers?visitorId=12345');
      });
    }));
  });

  describe('when Matomo is not enabled', () => {
    beforeEach(waitForAsync(() => {
      init();
      (matomoService.isMatomoEnabled$ as jasmine.Spy).and.returnValue(of(false));
      initTestbed();
    }));
    beforeEach(() => {
      fixture = TestBed.createComponent(BitstreamDownloadPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should not append visitor ID to the file link', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(matomoService.appendVisitorId).not.toHaveBeenCalled();
        expect(hardRedirectService.redirect).toHaveBeenCalledWith('content-url-with-headers');
      });
    }));
  });
});
