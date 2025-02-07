import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from '../../core/auth/auth.service';
import { FileService } from '../../core/shared/file.service';
import { of as observableOf } from 'rxjs';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BitstreamDownloadPageComponent } from './bitstream-download-page.component';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { HardRedirectService } from '../../core/services/hard-redirect.service';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { ServerResponseService } from '../../core/services/server-response.service';
import { PLATFORM_ID } from '@angular/core';
import { NativeWindowRef, NativeWindowService } from '../../core/services/window.service';

describe('BitstreamDownloadPageComponent', () => {
  let component: BitstreamDownloadPageComponent;
  let fixture: ComponentFixture<BitstreamDownloadPageComponent>;

  let authService: AuthService;
  let fileService: FileService;
  let authorizationService: AuthorizationDataService;
  let hardRedirectService: HardRedirectService;
  let activatedRoute;
  let router;

  let bitstream: Bitstream;
  let serverResponseService: jasmine.SpyObj<ServerResponseService>;
  let signpostingDataService: jasmine.SpyObj<SignpostingDataService>;

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
    bitstream = Object.assign(new Bitstream(), {
      uuid: 'bitstreamUuid',
      _links: {
        content: { href: 'bitstream-content-link' },
        self: { href: 'bitstream-self-link' },
      }
    });

    activatedRoute = {
      data: observableOf({
        bitstream: createSuccessfulRemoteDataObject(
          bitstream
        )
      }),
      params: observableOf({
        id: 'testid'
      })
    };

    router = jasmine.createSpyObj('router', ['navigateByUrl']);

    serverResponseService = jasmine.createSpyObj('ServerResponseService', {
      setHeader: jasmine.createSpy('setHeader'),
    });

    signpostingDataService = jasmine.createSpyObj('SignpostingDataService', {
      getLinks: observableOf([mocklink, mocklink2])
    });
  }

  function initTestbed() {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [BitstreamDownloadPageComponent],
      providers: [
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: AuthService, useValue: authService },
        { provide: FileService, useValue: fileService },
        { provide: HardRedirectService, useValue: hardRedirectService },
        { provide: ServerResponseService, useValue: serverResponseService },
        { provide: SignpostingDataService, useValue: signpostingDataService },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
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
});
