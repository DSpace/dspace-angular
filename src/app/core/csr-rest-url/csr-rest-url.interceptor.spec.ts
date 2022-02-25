import { CsrRestUrlInterceptor } from './csr-rest-url.interceptor';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { DefaultAppConfig } from 'src/config/default-app-config';

describe('CsrRestUrlInterceptor', () => {
  let service: DspaceRestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DspaceRestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CsrRestUrlInterceptor,
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
        }
      ],
    });

    service = TestBed.inject(DspaceRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should switch base URL with REST URL', () => {
    service.get('http://localhost:8080/server/api').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const httpRequest = httpMock.expectOne('https://api7.dspace.org/server/api');
    expect(httpRequest.request.url).toEqual('https://api7.dspace.org/server/api');
  });
});
