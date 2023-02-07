import { AuthRequestService } from './auth-request.service';
import { RequestService } from '../data/request.service';
import { ServerAuthRequestService } from './server-auth-request.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { XSRF_RESPONSE_HEADER } from '../xsrf/xsrf.interceptor';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { PostRequest } from '../data/request.models';

describe(`ServerAuthRequestService`, () => {
  let href: string;
  let requestService: RequestService;
  let service: AuthRequestService;
  let httpClient: HttpClient;
  let httpResponse: HttpResponse<any>;
  let halService: HALEndpointService;
  const mockToken = 'mock-token';

  beforeEach(() => {
    href = 'https://rest.api/auth/shortlivedtokens';
    requestService = jasmine.createSpyObj('requestService', {
      'generateRequestId': '8bb0582d-5013-4337-af9c-763beb25aae2'
    });
    httpResponse = {
      body: { bar: false },
      headers: new HttpHeaders({ XSRF_RESPONSE_HEADER: mockToken }),
      statusText: '200'
    } as HttpResponse<any>;
    httpClient = jasmine.createSpyObj('httpClient', {
      get: observableOf(httpResponse),
    });
    halService = jasmine.createSpyObj('halService', {
      'getRootHref': '/api'
    });
    service = new ServerAuthRequestService(halService, requestService, null, httpClient);
  });

  describe(`createShortLivedTokenRequest`, () => {
    it(`should return a PostRequest`, () => {
      const obs = (service as any).createShortLivedTokenRequest(href) as Observable<PostRequest>;
      obs.subscribe((result: PostRequest) => {
        expect(result.constructor.name).toBe('PostRequest');
      });
    });

    it(`should return a request with the given href`, () => {
      const obs = (service as any).createShortLivedTokenRequest(href) as Observable<PostRequest>;
      obs.subscribe((result: PostRequest) => {
        expect(result.href).toBe(href) ;
      });
    });

    it(`should return a request with a xsrf header`, () => {
      const obs = (service as any).createShortLivedTokenRequest(href) as Observable<PostRequest>;
      obs.subscribe((result: PostRequest) => {
        expect(result.options.headers.get(XSRF_RESPONSE_HEADER)).toBe(mockToken);
      });
    });
  });
});
