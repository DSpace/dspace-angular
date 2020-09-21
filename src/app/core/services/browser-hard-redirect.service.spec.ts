import {TestBed} from '@angular/core/testing';
import {BrowserHardRedirectService} from './browser-hard-redirect.service';

describe('BrowserHardRedirectService', () => {

  const mockLocation = {
    href: undefined,
    pathname: '/pathname',
    search: '/search',
  } as Location;

  const service: BrowserHardRedirectService = new BrowserHardRedirectService(mockLocation);

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when performing a redirect', () => {

    const redirect = 'test redirect';

    beforeEach(() => {
      service.redirect(redirect);
    });

    it('should update the location', () => {
      expect(mockLocation.href).toEqual(redirect);
    })
  });

  describe('when requesting the current route', () => {

    it('should return the location origin', () => {
      expect(service.getCurrentRoute()).toEqual(mockLocation.pathname + mockLocation.search);
    });
  });
});
