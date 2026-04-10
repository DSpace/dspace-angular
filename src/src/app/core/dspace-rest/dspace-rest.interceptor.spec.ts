import {
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { DspaceRestInterceptor } from './dspace-rest.interceptor';
import { DspaceRestService } from './dspace-rest.service';

describe('DspaceRestInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const appConfig: Partial<AppConfig> = {
    rest: {
      ssl: false,
      host: 'localhost',
      port: 8080,
      nameSpace: '/server',
      baseUrl: 'http://api.example.com/server',
    },
  };
  const appConfigWithSSR: Partial<AppConfig> = {
    rest: {
      ssl: false,
      host: 'localhost',
      port: 8080,
      nameSpace: '/server',
      baseUrl: 'http://api.example.com/server',
      ssrBaseUrl: 'http://ssr.example.com/server',
    },
  };

  describe('When SSR base URL is not set ', () => {
    describe('and it\'s in the browser', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [
            DspaceRestService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: DspaceRestInterceptor,
              multi: true,
            },
            { provide: APP_CONFIG, useValue: appConfig },
            { provide: PLATFORM_ID, useValue: 'browser' },
          ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
      });

      it('should not modify the request', () => {
        const url = 'http://api.example.com/server/items';
        httpClient.get(url).subscribe((response) => {
          expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(url);
        expect(req.request.url).toBe(url);
        req.flush({});
        httpMock.verify();
      });
    });

    describe('and it\'s in SSR mode', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [
            DspaceRestService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: DspaceRestInterceptor,
              multi: true,
            },
            { provide: APP_CONFIG, useValue: appConfig },
            { provide: PLATFORM_ID, useValue: 'server' },
          ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
      });

      it('should not replace the base URL', () => {
        const url = 'http://api.example.com/server/items';

        httpClient.get(url).subscribe((response) => {
          expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(url);
        expect(req.request.url).toBe(url);
        req.flush({});
        httpMock.verify();
      });
    });
  });

  describe('When SSR base URL is set ', () => {
    describe('and it\'s in the browser', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [
            DspaceRestService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: DspaceRestInterceptor,
              multi: true,
            },
            { provide: APP_CONFIG, useValue: appConfigWithSSR },
            { provide: PLATFORM_ID, useValue: 'browser' },
          ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
      });

      it('should not modify the request', () => {
        const url = 'http://api.example.com/server/items';
        httpClient.get(url).subscribe((response) => {
          expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(url);
        expect(req.request.url).toBe(url);
        req.flush({});
        httpMock.verify();
      });
    });

    describe('and it\'s in SSR mode', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [
            DspaceRestService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: DspaceRestInterceptor,
              multi: true,
            },
            { provide: APP_CONFIG, useValue: appConfigWithSSR },
            { provide: PLATFORM_ID, useValue: 'server' },
          ],
        });

        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
      });

      it('should replace the base URL', () => {
        const url = 'http://api.example.com/server/items';
        const ssrBaseUrl = appConfigWithSSR.rest.ssrBaseUrl;

        httpClient.get(url).subscribe((response) => {
          expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(ssrBaseUrl + '/items');
        expect(req.request.url).toBe(ssrBaseUrl + '/items');
        req.flush({});
        httpMock.verify();
      });

      it('should not replace any query param containing the base URL', () => {
        const url = 'http://api.example.com/server/items?url=http://api.example.com/server/item/1';
        const ssrBaseUrl = appConfigWithSSR.rest.ssrBaseUrl;

        httpClient.get(url).subscribe((response) => {
          expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(ssrBaseUrl + '/items?url=http://api.example.com/server/item/1');
        expect(req.request.url).toBe(ssrBaseUrl + '/items?url=http://api.example.com/server/item/1');
        req.flush({});
        httpMock.verify();
      });
    });
  });
});
