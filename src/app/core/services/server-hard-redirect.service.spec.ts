import { TestBed } from '@angular/core/testing';
import { ServerHardRedirectService } from './server-hard-redirect.service';

describe('ServerHardRedirectService', () => {

  const mockRequest = jasmine.createSpyObj(['get']);
  const mockResponse = jasmine.createSpyObj(['redirect', 'end']);

  const service: ServerHardRedirectService = new ServerHardRedirectService(mockRequest, mockResponse);
  const origin = 'https://test-host.com:4000';

  beforeEach(() => {
    mockRequest.protocol = 'https';
    mockRequest.headers = {
      host: 'test-host.com:4000',
    };

    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when performing a default redirect', () => {
    const redirect = 'test redirect';

    beforeEach(() => {
      service.redirect(redirect);
    });

    it('should perform a 302 redirect', () => {
      expect(mockResponse.redirect).toHaveBeenCalledWith(302, redirect);
      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe('when performing a 301 redirect', () => {
    const redirect = 'test 301 redirect';
    const redirectStatusCode = 301;

    beforeEach(() => {
      service.redirect(redirect, redirectStatusCode);
    });

    it('should redirect with passed in status code', () => {
      expect(mockResponse.redirect).toHaveBeenCalledWith(redirectStatusCode, redirect);
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

});
