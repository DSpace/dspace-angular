import { ServerReferrerService } from './server.referrer.service';

describe(`ServerReferrerService`, () => {
  let service: ServerReferrerService;
  const referrer = 'https://www.referrer.com';

  describe(`getReferrer`, () => {
    describe(`when the referer header is set`, () => {
      beforeEach(() => {
        service = new ServerReferrerService({ headers: { referer: referrer } });
      });

      it(`should return the referer header`, (done: DoneFn) => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe(referrer);
          done();
        });
      });
    });

    describe(`when the referer header is not set`, () => {
      beforeEach(() => {
        service = new ServerReferrerService({ headers: {} });
      });

      it(`should return an empty string`, (done: DoneFn) => {
        service.getReferrer().subscribe((emittedReferrer: string) => {
          expect(emittedReferrer).toBe('');
          done();
        });
      });
    });
  });
});
