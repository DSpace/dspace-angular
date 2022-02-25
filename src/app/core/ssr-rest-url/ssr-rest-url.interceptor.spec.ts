import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { DefaultAppConfig } from 'src/config/default-app-config';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { SsrRestUrlInterceptor } from './ssr-rest-url.interceptor';

describe('SsrRestUrlInterceptor', () => {
  let service: DspaceRestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DspaceRestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SsrRestUrlInterceptor,
          multi: true,
        },
        {
          provide: APP_CONFIG,
          useValue: {
            ...new DefaultAppConfig(),
            rest: {
              ssl: true,
              host: 'api7.dspace.org',
              port: 443,
              nameSpace: '/server',
              baseUrl: 'https://api7.dspace.org/server'
            },
            ssr: {
              rest: {
                ssl: false,
                host: 'localhost',
                port: 8080,
                nameSpace: '/server',
                baseUrl: 'http://localhost:8080/server'
              }
            }
          }
        },
        { provide: REQUEST, useValue: { get: () => undefined } }
      ],
    });

    service = TestBed.inject(DspaceRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should switch base URL with SSR REST URL', () => {
    service.get('https://api7.dspace.org/server/api').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('http://localhost:8080/server/api');
    expect(httpRequest.request.url).toEqual('http://localhost:8080/server/api');
  });
});
