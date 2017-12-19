import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DSpaceRESTv2Service } from './dspace-rest-v2.service';

describe('DSpaceRESTv2Service', () => {
  let dSpaceRESTv2Service: DSpaceRESTv2Service;
  let httpMock: HttpTestingController;
  const mockDSpaceRESTV2Response = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DSpaceRESTv2Service]
    });

    dSpaceRESTv2Service = TestBed.get(DSpaceRESTv2Service);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([DSpaceRESTv2Service], (service: DSpaceRESTv2Service) => {
    expect(service).toBeTruthy();
  }));

  describe('#get', () => {
    it('should return an Observable<DSpaceRESTV2Response>', () => {
      const url = 'http://www.dspace.org/';
      dSpaceRESTv2Service.get(url).subscribe((response) => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(mockDSpaceRESTV2Response);
    });
  });
});
