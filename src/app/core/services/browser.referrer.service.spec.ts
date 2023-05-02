import { of as observableOf } from 'rxjs';
import { RouteService } from './route.service';
import { BrowserReferrerService } from './browser.referrer.service';

describe(`BrowserReferrerService`, () => {
  let service: BrowserReferrerService;
  const documentReferrer = 'https://www.referrer.com';
  const origin = 'https://www.dspace.org';
  let routeService: RouteService;

  beforeEach(() => {
    routeService = {
      getPreviousUrl: () => observableOf('')
    } as any;
    service = new BrowserReferrerService(
      { referrer: documentReferrer },
      routeService,
      { getCurrentOrigin: () => origin } as any
    );
  });

  describe(`getReferrer`, () => {
    let prevUrl: string;

    describe(`when getPreviousUrl is an empty string`, () => {
      beforeEach(() => {
        prevUrl = '';
        spyOn(routeService, 'getPreviousUrl').and.returnValue(observableOf(prevUrl));
      });

      it(`should return document.referrer`, (done: DoneFn) => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(documentReferrer);
          done();
        });
      });
    });

    describe(`when getPreviousUrl is not empty`, () => {
      beforeEach(() => {
        prevUrl = '/some/local/route';
        spyOn(routeService, 'getPreviousUrl').and.returnValue(observableOf(prevUrl));
      });

      it(`should return the value emitted by getPreviousUrl combined with the origin from HardRedirectService`, (done: DoneFn) => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(origin + prevUrl);
          done();
        });
      });
    });
  });
});
