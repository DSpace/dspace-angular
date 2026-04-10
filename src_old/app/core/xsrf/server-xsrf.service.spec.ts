import { HttpClient } from '@angular/common/http';

import { ServerXSRFService } from './server-xsrf.service';

describe(`ServerXSRFService`, () => {
  let service: ServerXSRFService;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj(['post', 'get', 'request']);
    service = new ServerXSRFService();
  });

  describe(`initXSRFToken`, () => {
    it(`shouldn't perform any requests`, (done: DoneFn) => {
      service.initXSRFToken(httpClient)().then(() => {
        for (const prop in httpClient) {
          if (httpClient.hasOwnProperty(prop)) {
            expect(httpClient[prop]).not.toHaveBeenCalled();
          }
        }
        done();
      });
    });

    it(`should leave tokenInitialized$ on false`, (done: DoneFn) => {
      service.initXSRFToken(httpClient)().then(() => {
        expect(service.tokenInitialized$.getValue()).toBeFalse();
        done();
      });
    });
  });
});
