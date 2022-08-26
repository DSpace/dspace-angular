import { TestBed } from '@angular/core/testing';
import { ServerHardRedirectService } from './server-hard-redirect.service';
import { environment } from '../../../environments/environment';

describe('ServerHardRedirectService', () => {

  const mockRequest = jasmine.createSpyObj(['get']);
  const mockResponse = jasmine.createSpyObj(['redirect', 'end']);

  const service: ServerHardRedirectService = new ServerHardRedirectService(mockRequest, mockResponse);
  const origin = 'http://test-host.com:4000';

  beforeEach(() => {
    mockRequest.protocol = 'http';
    mockRequest.headers = {
      host: 'test-host.com:4000',
    };

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

    it('should update the response object', () => {
      expect(mockResponse.redirect).toHaveBeenCalledWith(302, redirect);
      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe('when requesting the current route', () => {

    beforeEach(() => {
      mockRequest.originalUrl = 'original/url';
    });

    it('should return the location origin', () => {
      expect(service.getCurrentRoute()).toEqual(mockRequest.originalUrl);
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

    it('should return the location origin with HTTPS', () => {
      expect(service.getCurrentOrigin()).toEqual(origin.replace('http://', 'https://'));
    });

    afterEach(() => {
      (environment.ui as any).forceHTTPSInOrigin = originalValue;
    });
  });

  describe('when requesting the origin with forceHTTPSInOrigin unset and production set to false', () => {
    let originalValue;
    let originalProdValue;
    beforeEach(() => {
      originalValue = (environment.ui as any).forceHTTPSInOrigin;
      originalProdValue = (environment as any).production;
      (environment.ui as any).forceHTTPSInOrigin = undefined;
      (environment as any).production = false;
    });

    it('should return the location origin with the original protocol', () => {
      expect(service.getCurrentOrigin()).toEqual(origin);
    });

    afterEach(() => {
      (environment.ui as any).forceHTTPSInOrigin = originalValue;
      (environment as any).production = originalProdValue;
    });
  });

  describe('when requesting the origin with forceHTTPSInOrigin unset and production set to true', () => {
    let originalValue;
    let originalProdValue;
    beforeEach(() => {
      originalValue = (environment.ui as any).forceHTTPSInOrigin;
      originalProdValue = (environment as any).production;
      (environment.ui as any).forceHTTPSInOrigin = undefined;
      (environment as any).production = true;
    });

    it('should return the location origin with https', () => {
      expect(service.getCurrentOrigin()).toEqual(origin.replace('http://', 'https://'));
    });

    afterEach(() => {
      (environment.ui as any).forceHTTPSInOrigin = originalValue;
      (environment as any).production = originalProdValue;
    });
  });

});
