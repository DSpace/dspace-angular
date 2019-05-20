import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DEFAULT_CONTENT_TYPE, DSpaceRESTv2Service } from './dspace-rest-v2.service';
import { DSpaceObject } from '../shared/dspace-object.model';
import { RestRequestMethod } from '../data/rest-request-method';
import { HttpHeaders } from '@angular/common/http';

describe('DSpaceRESTv2Service', () => {
  let dSpaceRESTv2Service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;
  const url = 'http://www.dspace.org/';
  const mockError: any = {
    statusCode: 0,
    statusText: 'Unknown Error',
    message: 'Http failure response for http://www.dspace.org/: 0 '
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DSpaceRESTv2Service]
    });

    dSpaceRESTv2Service = TestBed.get(DSpaceRESTv2Service);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', inject([DSpaceRESTv2Service], (service: DSpaceRESTv2Service) => {
    expect(service).toBeTruthy();
  }));

  describe('#get', () => {
    it('should return an Observable<DSpaceRESTV2Response>', () => {
      const mockPayload = {
        page: 1
      };
      const mockStatusCode = 200;
      const mockStatusText = 'GREAT';

      dSpaceRESTv2Service.get(url).subscribe((response) => {
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
      dSpaceRESTv2Service.get(url).subscribe(() => undefined, (err) => {
        expect(err).toEqual(mockError);
      });
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.error(mockError);
    });

    it('should log an error', () => {
      spyOn(console, 'log');

      dSpaceRESTv2Service.get(url).subscribe(() => undefined, (err) => {
        expect(console.log).toHaveBeenCalled();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.error(mockError);
    });

    it('when no content-type header is provided, it should use application/json', () => {
      dSpaceRESTv2Service.request(RestRequestMethod.POST, url, {}).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).toContain(DEFAULT_CONTENT_TYPE);
    });
  });

  describe('#request', () => {
    it('should return an Observable<DSpaceRESTV2Response>', () => {
      const mockPayload = {
        page: 1
      };
      const mockStatusCode = 200;
      const mockStatusText = 'GREAT';

      dSpaceRESTv2Service.request(RestRequestMethod.POST, url, {}).subscribe((response) => {
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
      dSpaceRESTv2Service.request(RestRequestMethod.POST, url, {}, { headers }).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).not.toContain(DEFAULT_CONTENT_TYPE);
    });

    it('when no content-type header is provided, it should use application/json', () => {
      dSpaceRESTv2Service.request(RestRequestMethod.POST, url, {}).subscribe();

      const req = httpMock.expectOne(url);
      expect(req.request.headers.get('Content-Type')).toContain(DEFAULT_CONTENT_TYPE);
    });
  });

  describe('buildFormData', () => {
    it('should return the correct data', () => {
      const name = 'testname';
      const dso: DSpaceObject = {
        name: name
      } as DSpaceObject;
      const formdata = dSpaceRESTv2Service.buildFormData(dso);
      expect(formdata.get('name')).toBe(name);
    });
  });
});
