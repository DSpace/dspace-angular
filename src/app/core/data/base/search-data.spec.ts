/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { constructSearchEndpointDefault, SearchData, SearchDataImpl } from './search-data';
import { FindListOptions } from '../find-list-options.model';
import { followLink } from '../../../shared/utils/follow-link-config.model';
import { of as observableOf } from 'rxjs';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { getMockRemoteDataBuildService } from '../../../shared/mocks/remote-data-build.service.mock';
import createSpyObj = jasmine.createSpyObj;

/**
 * Tests whether calls to `SearchData` methods are correctly patched through in a concrete data service that implements it
 */
export function testSearchDataImplementation(service: SearchData<any>, methods = ['searchBy', 'getSearchByHref']) {
  describe('SearchData implementation', () => {
    const OPTIONS = Object.assign(new FindListOptions(), { elementsPerPage: 10, currentPage: 3 });
    const FOLLOWLINKS = [
      followLink('test'),
      followLink('something'),
    ];

    beforeEach(() => {
      (service as any).searchData = createSpyObj('searchData', {
        searchBy: 'TEST searchBy',
        getSearchByHref: 'TEST getSearchByHref',
      });
    });

    if ('searchBy' in methods) {
      it('should handle calls to searchBy', () => {
        const out: any = service.searchBy('searchMethod', OPTIONS, false, true, ...FOLLOWLINKS);

        expect((service as any).searchData.searchBy).toHaveBeenCalledWith('searchMethod', OPTIONS, false, true, ...FOLLOWLINKS);
        expect(out).toBe('TEST searchBy');
      });
    }

    if ('getSearchByHref' in methods) {
      it('should handle calls to getSearchByHref', () => {
        const out: any = service.getSearchByHref('searchMethod', OPTIONS, ...FOLLOWLINKS);

        expect((service as any).searchData.getSearchByHref).toHaveBeenCalledWith('searchMethod', OPTIONS, ...FOLLOWLINKS);
        expect(out).toBe('TEST getSearchByHref');
      });
    }
  });
}

const endpoint = 'https://rest.api/core';

describe('SearchDataImpl', () => {
  let service: SearchDataImpl<any>;
  let requestService;
  let halService;
  let rdbService;
  let linksToFollow;

  let constructSearchEndpointSpy;
  let options;

  function initTestService(): SearchDataImpl<any> {
    requestService = getMockRequestService();
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: observableOf(endpoint),
    });
    rdbService = getMockRemoteDataBuildService();
    linksToFollow = [
      followLink('a'),
      followLink('b'),
    ];

    constructSearchEndpointSpy = jasmine.createSpy('constructSearchEndpointSpy').and.callFake(constructSearchEndpointDefault);

    options = Object.assign(new FindListOptions(), {
      elementsPerPage: 5,
      currentPage: 3,
    });

    return new SearchDataImpl(
      'test',
      requestService,
      rdbService,
      undefined,
      halService,
      undefined,
      constructSearchEndpointSpy,
    );
  }

  beforeEach(() => {
    service = initTestService();
  });

  describe('getSearchEndpoint', () => {
    it('should return the search endpoint for the given method', (done) => {
      (service as any).getSearchEndpoint('testMethod').subscribe(searchEndpoint => {
        expect(halService.getEndpoint).toHaveBeenCalledWith('test');
        expect(searchEndpoint).toBe('https://rest.api/core/search/testMethod');
        done();
      });
    });

    it('should use constructSearchEndpoint to construct the search endpoint', (done) => {
      (service as any).getSearchEndpoint('testMethod').subscribe(() => {
        expect(constructSearchEndpointSpy).toHaveBeenCalledWith('https://rest.api/core', 'testMethod');
        done();
      });
    });
  });

  describe('getSearchByHref', () => {
    beforeEach(() => {
      spyOn(service as any, 'getSearchEndpoint').and.callThrough();
      spyOn(service, 'buildHrefFromFindOptions').and.callThrough();
    });

    it('should return the search endpoint with additional query parameters', (done) => {
      service.getSearchByHref('testMethod', options, ...linksToFollow).subscribe(href => {
        expect((service as any).getSearchEndpoint).toHaveBeenCalledWith('testMethod');
        expect(service.buildHrefFromFindOptions).toHaveBeenCalledWith(
          'https://rest.api/core/search/testMethod',
          options,
          [],
          ...linksToFollow,
        );

        expect(href).toBe('https://rest.api/core/search/testMethod?page=2&size=5&embed=a&embed=b');

        done();
      });
    });
  });

  describe('searchBy', () => {
    it('should patch getSearchEndpoint into findListByHref and return the result', () => {
      spyOn(service, 'getSearchByHref').and.returnValue('endpoint' as any);
      spyOn(service, 'findListByHref').and.returnValue('resulting remote data' as any);

      const out: any = service.searchBy('testMethod', options, false, true, ...linksToFollow);

      expect(service.getSearchByHref).toHaveBeenCalledWith('testMethod', options, ...linksToFollow);
      expect(service.findListByHref).toHaveBeenCalledWith('endpoint', undefined, false, true);
      expect(out).toBe('resulting remote data');
    });
  });
});
