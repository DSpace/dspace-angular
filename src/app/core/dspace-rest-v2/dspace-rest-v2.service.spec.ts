import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DSpaceRESTv2Service } from './dspace-rest-v2.service';
import { DSpaceObject } from '../shared/dspace-object.model';

describe('DSpaceRESTv2Service', () => {
  let dSpaceRESTv2Service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;
  const url = 'http://www.dspace.org/';
  const mockError = new ErrorEvent('test error');

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
      const mockStatusCode = 'GREAT';

      dSpaceRESTv2Service.get(url).subscribe((response) => {
        expect(response).toBeTruthy();
        expect(response.statusCode).toEqual(mockStatusCode);
        expect(response.payload.page).toEqual(mockPayload.page);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockPayload, { statusText: mockStatusCode});
    });
  });

  it('should throw an error', () => {
    dSpaceRESTv2Service.get(url).subscribe(() => undefined, (err) => {
      expect(err.error).toBe(mockError);
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

  fdescribe('buildFormData', () => {
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
