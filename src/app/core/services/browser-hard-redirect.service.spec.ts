import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { BrowserHardRedirectService } from './browser-hard-redirect.service';

describe('BrowserHardRedirectService', () => {
  let origin: string;
  let mockLocation: Location;
  let service: BrowserHardRedirectService;
  let originalBaseUrl;

  beforeEach(() => {
    origin = 'https://test-host.com:4000';
    mockLocation = {
      href: undefined,
      pathname: '/pathname',
      search: '/search',
      origin,
      replace: (url: string) => {
        mockLocation.href = url;
      },
    } as Location;
    spyOn(mockLocation, 'replace');

    // Store original environment variable to restore after tests
    originalBaseUrl = environment.ui.baseUrl;

    // Set environment variable to match our mock location origin for testing
    environment.ui.baseUrl = origin;

    service = new BrowserHardRedirectService(mockLocation);

    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    // Restore original environment variable after tests
    environment.ui.baseUrl = originalBaseUrl;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when performing a redirect', () => {

    const redirect = 'test redirect';

    beforeEach(() => {
      service.redirect(redirect);
    });

    it('should call location.replace with the new url', () => {
      expect(mockLocation.replace).toHaveBeenCalledWith(redirect);
    });
  });

  describe('when requesting the current route', () => {

    it('should return the location origin', () => {
      expect(service.getCurrentRoute()).toEqual(mockLocation.pathname + mockLocation.search);
    });
  });

  describe('when requesting the origin', () => {

    it('should return the location origin', () => {
      expect(service.getBaseUrl()).toEqual(origin);
    });
  });

});
