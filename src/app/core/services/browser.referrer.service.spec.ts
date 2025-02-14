import { of as observableOf } from 'rxjs';

import { BrowserReferrerService } from './browser.referrer.service';
import { RouteService } from './route.service';

describe(`BrowserReferrerService`, () => {
  let service: BrowserReferrerService;
  const documentReferrer = 'https://www.referrer.com';
  const origin = 'https://www.dspace.org';
  let routeService: RouteService;

  beforeEach(() => {
    routeService = {
      getHistory: () => observableOf([]),
    } as any;
    service = new BrowserReferrerService(
      { referrer: documentReferrer },
      routeService,
      { getCurrentOrigin: () => origin } as any,
    );
  });

  describe(`getReferrer`, () => {
    describe(`when the history is an empty`, () => {
      beforeEach(() => {
        spyOn(routeService, 'getHistory').and.returnValue(observableOf([]));
      });

      it(`should return document.referrer`, (done: DoneFn) => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(documentReferrer);
          done();
        });
      });
    });

    describe(`when the history only contains the current route`, () => {
      beforeEach(() => {
        spyOn(routeService, 'getHistory').and.returnValue(observableOf(['/current/route']));
      });

      it(`should return document.referrer`, (done: DoneFn) => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(documentReferrer);
          done();
        });
      });
    });

    describe(`when the history contains multiple routes`, () => {
      const prevUrl = '/the/route/we/need';
      beforeEach(() => {
        spyOn(routeService, 'getHistory').and.returnValue(observableOf([
          '/first/route',
          '/second/route',
          prevUrl,
          '/current/route',
        ]));
      });

      it(`should return the last route before the current one combined with the origin from HardRedirectService`, (done: DoneFn) => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(origin + prevUrl);
          done();
        });
      });
    });
  });
});
