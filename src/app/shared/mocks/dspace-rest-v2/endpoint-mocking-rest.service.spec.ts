import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { of as observableOf } from 'rxjs';
import { GlobalConfig } from '../../../../config/global-config.interface';
import { RestRequestMethod } from '../../../core/data/rest-request-method';
import { EndpointMockingRestService } from './endpoint-mocking-rest.service';
import { MockResponseMap } from './mocks/mock-response-map';

describe('EndpointMockingRestService', () => {
  let service: EndpointMockingRestService;

  const serverHttpResponse: HttpResponse<any> = {
    body: { bar: false },
    headers: new HttpHeaders(),
    statusText: '200'
  } as HttpResponse<any>;

  const mockResponseMap: MockResponseMap = new Map([
    [ '/foo', { bar: true } ]
  ]);

  beforeEach(() => {
    const EnvConfig = {
      rest: {
        nameSpace: '/api'
      }
    } as GlobalConfig;

    const httpStub = jasmine.createSpyObj('http', {
      get: observableOf(serverHttpResponse),
      request: observableOf(serverHttpResponse)
    });

    service = new EndpointMockingRestService(EnvConfig, mockResponseMap, httpStub);
  });

  describe('get', () => {
    describe('when the URL is mocked', () => {
      it('should return the mock data', (done) => {
        service.get('https://rest.com/api/foo').subscribe((response) => {
          expect(response.payload).toEqual({ bar: true });
          done();
        });
      });
    });

    describe('when the URL isn\'t mocked', () => {
      it('should return the server data', (done) => {
        service.get('https://rest.com/api').subscribe((response) => {
          expect(response.payload).toEqual({ bar: false });
          done();
        });
      });
    });
  });

  describe('request', () => {
    describe('when the URL is mocked', () => {
      it('should return the mock data', (done) => {
        service.request(RestRequestMethod.GET, 'https://rest.com/api/foo').subscribe((response) => {
          expect(response.payload).toEqual({ bar: true });
          done();
        });
      });
    });

    describe('when the URL isn\'t mocked', () => {
      it('should return the server data', (done) => {
        service.request(RestRequestMethod.GET, 'https://rest.com/api').subscribe((response) => {
          expect(response.payload).toEqual({ bar: false });
          done();
        });
      });
    });
  });
});
