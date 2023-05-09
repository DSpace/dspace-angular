import { BrowserXSRFService } from './browser-xsrf.service';
import { HttpClient } from '@angular/common/http';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe(`BrowserXSRFService`, () => {
  let service: BrowserXSRFService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const endpointURL = new RESTURLCombiner('/security/csrf').toString();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ BrowserXSRFService ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BrowserXSRFService);
  });

  describe(`initXSRFToken`, () => {
    it(`should perform a POST to the csrf endpoint`, () => {
      service.initXSRFToken(httpClient)();

      const req = httpTestingController.expectOne({
        url: endpointURL,
        method: 'POST'
      });

      req.flush({});
      httpTestingController.verify();
    });

    describe(`when the POST succeeds`, () => {
      it(`should set tokenInitialized$ to true`, () => {
        service.initXSRFToken(httpClient)();

        const req = httpTestingController.expectOne(endpointURL);

        req.flush({});
        httpTestingController.verify();

        expect(service.tokenInitialized$.getValue()).toBeTrue();
      });
    });

    describe(`when the POST fails`, () => {
      it(`should set tokenInitialized$ to true`, () => {
        service.initXSRFToken(httpClient)();

        const req = httpTestingController.expectOne(endpointURL);

        req.error(new ErrorEvent('415'));
        httpTestingController.verify();

        expect(service.tokenInitialized$.getValue()).toBeTrue();
      });
    });

  });
});
