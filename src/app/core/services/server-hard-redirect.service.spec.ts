import { TestBed } from '@angular/core/testing';
import { AppConfig } from '@dspace/config/app-config.interface';

import { ServerHardRedirectService } from './server-hard-redirect.service';

describe('ServerHardRedirectService', () => {

  const mockRequest = jasmine.createSpyObj(['get']);
  const mockResponse = jasmine.createSpyObj(['redirect', 'end']);
  const envConfig = {
    rest: {
      ssl: true,
      host: 'rest.com',
      port: 443,
      // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
      nameSpace: '/api',
      baseUrl: 'https://rest.com/server',
    },
  } as AppConfig;

  let service: ServerHardRedirectService = new ServerHardRedirectService(envConfig, mockRequest, mockResponse);
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

  describe('when SSR base url is set', () => {
    const redirect = 'https://private-url:4000/server/api/bitstreams/uuid';
    const replacedUrl = 'https://public-url/server/api/bitstreams/uuid';
    const environmentWithSSRUrl: any = { ...envConfig, ...{ ...envConfig.rest, rest: {
      ssrBaseUrl: 'https://private-url:4000/server',
      baseUrl: 'https://public-url/server',
    } } };
    service = new ServerHardRedirectService(environmentWithSSRUrl, mockRequest, mockResponse);

    beforeEach(() => {
      service.redirect(redirect);
    });

    it('should perform a 302 redirect', () => {
      expect(mockResponse.redirect).toHaveBeenCalledWith(302, replacedUrl);
      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

});
