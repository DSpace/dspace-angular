import {
  HttpErrorResponse,
  HttpHeaders,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  inject,
  TestBed,
} from '@angular/core/testing';

import { RestRequestMethod } from '../data/rest-request-method';
import { DSpaceObject } from '../shared/dspace-object.model';
import {
  DEFAULT_CONTENT_TYPE,
  DspaceRestService,
} from './dspace-rest.service';

describe('DspaceRestService', () => {
  let dspaceRestService: DspaceRestService;
  let httpMock: HttpTestingController;
  const url = 'http://www.dspace.org/';

  const mockError = new HttpErrorResponse({
    status: 0,
    statusText: 'Unknown Error',
    error: {
      message: 'Http failure response for http://www.dspace.org/: 0 ',
    },
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DspaceRestService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    dspaceRestService = TestBed.inject(DspaceRestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', inject([DspaceRestService], (service: DspaceRestService) => {
    expect(service).toBeTruthy();
  }));

  describe('#get', () => {
    it('should return an Observable<RawRestResponse>', () => {
      const mockPayload = {
        page: 1,
      };
      const mockStatusCode = 200;
      const mockStatusText = 'GREAT';

      dspaceRestService.get(url).subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response.statusCode).toEqual(mockStatusCode);
        expect(response.statusText).toEqual(mockStatusText);
        expect(response.payload.page).toEqual(mockPayload.page);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockPayload, { status: mockStatusCode, statusText: mockStatusText });
    });
    it('should throw an error', () => {
      dspaceRestService.get(url).subscribe(() => undefined, (err: unknown) => {
        expect(err).toEqual(jasmine.objectContaining({
          statusCode: 0,
          statusText: 'Unknown Error',
          message: 'Http failure response for http://www.dspace.org/: 0 ',
        }));
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.error({ error: mockError } as ErrorEvent);
    });

    it('should log an error', () => {
      spyOn(console, 'log');

      dspaceRestService.get(url).subscribe(() => undefined, (err: unknown) => {
        expect(console.log).toHaveBeenCalled();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.error({ error: mockError } as ErrorEvent);
    });

    it('when no content-type header is provided, it should use application/json', () => {
      dspaceRestService.request(RestRequestMethod.POST, url, {}).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).toContain(DEFAULT_CONTENT_TYPE);
    });
  });

  describe('#request', () => {
    it('should return an Observable<RawRestResponse>', () => {
      const mockPayload = {
        page: 1,
      };
      const mockStatusCode = 200;
      const mockStatusText = 'GREAT';

      dspaceRestService.request(RestRequestMethod.POST, url, {}).subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response.statusCode).toEqual(mockStatusCode);
        expect(response.statusText).toEqual(mockStatusText);
        expect(response.payload.page).toEqual(mockPayload.page);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      req.flush(mockPayload, { status: mockStatusCode, statusText: mockStatusText });
    });

    it('when a content-type header is provided, it should not use application/json', () => {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'text/html');
      dspaceRestService.request(RestRequestMethod.POST, url, {}, { headers }).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).not.toContain(DEFAULT_CONTENT_TYPE);
    });

    it('when no content-type header is provided, it should use application/json', () => {
      dspaceRestService.request(RestRequestMethod.POST, url, {}).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).toContain(DEFAULT_CONTENT_TYPE);
    });
  });

  describe('buildFormData', () => {
    it('should return the correct data', () => {
      const name = 'testname';
      const dso: DSpaceObject = {
        name: name,
      } as DSpaceObject;
      const formdata = dspaceRestService.buildFormData(dso);
      expect(formdata.get('name')).toBe(name);
    });
  });
});
