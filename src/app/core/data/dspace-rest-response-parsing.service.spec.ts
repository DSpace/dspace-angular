import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';

import { ObjectCacheService } from '../cache/object-cache.service';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { getMockObjectCacheService } from '../testing/object-cache.service.mock';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import {
  GetRequest,
  PostRequest,
} from './request.models';
import { RestRequest } from './rest-request.model';

/**
 * Exposes the protected {@link DspaceRestResponseParsingService#ensureSelfLink} so it can be
 * tested in isolation.
 */
@Injectable()
class TestService extends DspaceRestResponseParsingService {
  public callEnsureSelfLink(request: RestRequest, response: RawRestResponse): RawRestResponse {
    return this.ensureSelfLink(request, response);
  }
}

describe('DspaceRestResponseParsingService', () => {
  let service: TestService;

  const MISMATCH = jasmine.stringMatching(/These don't match/);
  const REDUCED_PAGE = jasmine.stringMatching(/asked for a page of 9999 elements, but the REST API served 1000/);
  const NO_SELF_LINK = jasmine.stringMatching(/doesn't have a self link/);

  const requestFor = (href: string): RestRequest =>
    new GetRequest('c4f0b1b7-3ffa-4b1a-9f5f-8bd6b1c4de71', href);

  const responseWithSelfLink = (href: string, page?: any): RawRestResponse => ({
    payload: {
      _links: {
        self: { href },
      },
      ...(page ? { page } : {}),
    },
    statusCode: 200,
    statusText: 'OK',
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ObjectCacheService, useValue: getMockObjectCacheService() },
        { provide: APP_CONFIG, useValue: { rest: { baseUrl: 'https://rest.api' } } },
        TestService,
      ],
    });
    service = TestBed.inject(TestService);
    spyOn(console, 'warn');
  });

  describe('ensureSelfLink', () => {

    describe('differences the REST API is expected to introduce', () => {

      it('should not warn when the self link matches the requested url', () => {
        const href = 'https://rest.api/core/bundles/9d18168a/bitstreams?page=0&size=5';
        const response = service.callEnsureSelfLink(requestFor(href), responseWithSelfLink(href));

        expect(console.warn).not.toHaveBeenCalled();
        expect(response.payload._links.self.href).toBe(href);
      });

      it('should not warn when the self link only echoes the embed params of the request', () => {
        const href = 'https://rest.api/core/bundles/9d18168a/bitstreams?page=0&embed=accessStatus&size=5';
        const response = service.callEnsureSelfLink(requestFor(href), responseWithSelfLink(href));

        expect(console.warn).not.toHaveBeenCalled();
        // the self link is still normalized, because that's the url the response is cached under
        expect(response.payload._links.self.href).toBe('https://rest.api/core/bundles/9d18168a/bitstreams?page=0&size=5');
      });

      it('should not warn when the self link echoes embed params and the request has no other params', () => {
        const href = 'https://rest.api/core/items/eba1c085/bundles?embed=primaryBitstream&embed=bitstreams/format&embed.size=bitstreams=5';
        const response = service.callEnsureSelfLink(requestFor(href), responseWithSelfLink(href));

        expect(console.warn).not.toHaveBeenCalled();
        expect(response.payload._links.self.href).toBe('https://rest.api/core/items/eba1c085/bundles');
      });

      it('should not warn when the self link only percent decoded a param value', () => {
        const request = requestFor('https://rest.api/statistics/usagereports/search/object?page=-1&size=10&uri=https%3A%2F%2Frest.api%2Fcore%2Fsites%2F8f842a80');
        const response = service.callEnsureSelfLink(request, responseWithSelfLink(
          'https://rest.api/statistics/usagereports/search/object?page=-1&size=10&uri=https://rest.api/core/sites/8f842a80'));

        expect(console.warn).not.toHaveBeenCalled();
        expect(response.payload._links.self.href)
          .toBe('https://rest.api/statistics/usagereports/search/object?page=-1&size=10&uri=https%3A%2F%2Frest.api%2Fcore%2Fsites%2F8f842a80');
      });

      it('should not warn or normalize when params are only in a different order', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?page=0&size=5');
        const response = service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085/bundles?size=5&page=0'));

        expect(console.warn).not.toHaveBeenCalled();
        // the urls hold the same params, so nothing is rewritten here
        expect(response.payload._links.self.href).toBe('https://rest.api/core/items/eba1c085/bundles?size=5&page=0');
      });

    });

    describe('differences that point at a problem with the endpoint', () => {

      it('should say so when the REST API reduced the requested page size', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?size=9999');
        service.callEnsureSelfLink(request, responseWithSelfLink(
          'https://rest.api/core/items/eba1c085/bundles?size=1000',
          { number: 0, size: 1000, totalPages: 1, totalElements: 2 }));

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(REDUCED_PAGE);
      });

      it('should report a reduced page size alongside other params without confusing the two', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?page=0&size=9999&sort=name,ASC');
        service.callEnsureSelfLink(request, responseWithSelfLink(
          'https://rest.api/core/items/eba1c085/bundles?page=0&size=1000&sort=name,ASC'));

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(REDUCED_PAGE);
      });

      it('should fall back to the generic warning when more than the page size differs', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?page=0&size=9999');
        service.callEnsureSelfLink(request, responseWithSelfLink(
          'https://rest.api/core/items/eba1c085/bundles?page=3&size=1000'));

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(MISMATCH);
      });

      it('should use the generic warning when the returned page size is larger than requested', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?size=5');
        service.callEnsureSelfLink(request, responseWithSelfLink(
          'https://rest.api/core/items/eba1c085/bundles?size=50',
          { number: 0, size: 50, totalPages: 1, totalElements: 2 }));

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(MISMATCH);
      });

      it('should still warn when a param value differs beyond its encoding', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?uri=https%3A%2F%2Frest.api%2Fcore%2Fsites%2Faaa');
        service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085/bundles?uri=https://rest.api/core/sites/bbb'));

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(MISMATCH);
      });

      it('should report the normalized request url and the raw self link in the warning', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?page=0&embed=primaryBitstream&size=5');
        service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085/bundles?page=3&embed=primaryBitstream&size=5'));

        expect(console.warn).toHaveBeenCalledWith(
          'The response for \'https://rest.api/core/items/eba1c085/bundles?page=0&size=5\' has the self link ' +
          '\'https://rest.api/core/items/eba1c085/bundles?page=3&embed=primaryBitstream&size=5\'. ' +
          'These don\'t match. This could mean there\'s an issue with the REST endpoint');
      });

      it('should warn when a non-embed param differs', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?page=0&embed=primaryBitstream&size=5');
        service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085/bundles?page=3&embed=primaryBitstream&size=5'));

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(MISMATCH);
      });

      it('should warn when the self link has a param the request did not have', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?size=5');
        service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085/bundles?size=5&sort=name,ASC'));

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(MISMATCH);
      });

      it('should warn and fill in the requested url when the response has no self link', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?embed=primaryBitstream&size=5');
        const response = service.callEnsureSelfLink(request, {
          payload: { _links: {} },
          statusCode: 200,
          statusText: 'OK',
        });

        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.warn).toHaveBeenCalledWith(NO_SELF_LINK);
        expect(response.payload._links.self.href).toBe('https://rest.api/core/items/eba1c085/bundles?size=5');
      });

    });

    describe('normalization of the self link', () => {

      it('should normalize the self link when it differs, so it matches the cache key', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?page=0&embed=primaryBitstream&size=5');
        const response = service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085/bundles?page=3&embed=primaryBitstream&size=5'));

        expect(response.payload._links.self.href).toBe('https://rest.api/core/items/eba1c085/bundles?page=0&size=5');
      });

      it('should keep the other links when it normalizes the self link', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?page=0&size=5');
        const response = service.callEnsureSelfLink(request, {
          payload: {
            _links: {
              self: { href: 'https://rest.api/core/items/eba1c085/bundles?page=3&size=5' },
              primaryBitstream: { href: 'https://rest.api/core/bitstreams/6a5f' },
            },
          },
          statusCode: 200,
          statusText: 'OK',
        });

        expect(response.payload._links.self.href).toBe('https://rest.api/core/items/eba1c085/bundles?page=0&size=5');
        expect(response.payload._links.primaryBitstream.href).toBe('https://rest.api/core/bitstreams/6a5f');
      });

      it('should not touch a self link on a different host', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?size=5');
        const response = service.callEnsureSelfLink(request,
          responseWithSelfLink('https://other.api/core/items/eba1c085/bundles?size=5'));

        expect(console.warn).not.toHaveBeenCalled();
        expect(response.payload._links.self.href).toBe('https://other.api/core/items/eba1c085/bundles?size=5');
      });

      it('should not touch a self link that points at a different path', () => {
        const request = requestFor('https://rest.api/core/items/eba1c085/bundles?size=5');
        const response = service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085?size=5'));

        expect(console.warn).not.toHaveBeenCalled();
        expect(response.payload._links.self.href).toBe('https://rest.api/core/items/eba1c085?size=5');
      });

      it('should leave non-GET requests alone', () => {
        const request = new PostRequest('c4f0b1b7-3ffa-4b1a-9f5f-8bd6b1c4de71', 'https://rest.api/core/items/eba1c085/bundles?size=5');
        const response = service.callEnsureSelfLink(request,
          responseWithSelfLink('https://rest.api/core/items/eba1c085/bundles?size=1000'));

        expect(console.warn).not.toHaveBeenCalled();
        expect(response.payload._links.self.href).toBe('https://rest.api/core/items/eba1c085/bundles?size=1000');
      });

    });

  });
});
