import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { BrowserXSRFService } from './browser-xsrf.service';

describe(`BrowserXSRFService`, () => {
  let service: BrowserXSRFService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const endpointURL = new RESTURLCombiner('/security/csrf').toString();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ BrowserXSRFService ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BrowserXSRFService);
  });

  describe(`initXSRFToken`, () => {
    it(`should perform a GET to the csrf endpoint`, (done: DoneFn) => {
      service.initXSRFToken(httpClient)();

      const req = httpTestingController.expectOne({
        url: endpointURL,
        method: 'GET',
      });

      req.flush({});
      httpTestingController.verify();
      expect().nothing();
      done();
    });

    describe(`when the GET succeeds`, () => {
      it(`should set tokenInitialized$ to true`, (done: DoneFn) => {
        service.initXSRFToken(httpClient)();

        const req = httpTestingController.expectOne(endpointURL);

        req.flush({});
        httpTestingController.verify();

        expect(service.tokenInitialized$.getValue()).toBeTrue();
        done();
      });
    });

  });
});
