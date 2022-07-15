import { TestBed } from '@angular/core/testing';
import { BrowserHardRedirectService } from './browser-hard-redirect.service';
import { environment } from '../../../environments/environment';

describe('BrowserHardRedirectService', () => {
  const origin = 'http://test-host.com:4000';
  const host = 'test-host.com:4000';
  const mockLocation = {
    href: undefined,
    pathname: '/pathname',
    search: '/search',
    origin,
    host,
    replace: (url) => {mockLocation.href = url}
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
    });
  });

  describe('when requesting the current route', () => {

    it('should return the location origin', () => {
      expect(service.getCurrentRoute()).toEqual(mockLocation.pathname + mockLocation.search);
    });
  });

  describe('when requesting the origin', () => {

    it('should return the location origin', () => {
      expect(service.getCurrentOrigin()).toEqual(origin);
    });
  });

  describe('when requesting the origin with forceHTTPSInOrigin set to true', () => {
    let originalValue;
    beforeEach(() => {
      originalValue = (environment.ui as any).forceHTTPSInOrigin;
      (environment.ui as any).forceHTTPSInOrigin = true;
    });

    it('should return the location origin', () => {
      expect(service.getCurrentOrigin()).toEqual(origin.replace('http://', 'https://'));
    });

    afterEach(() => {
      (environment.ui as any).forceHTTPSInOrigin = originalValue;
    });
  });
});
