import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { DSpaceObjectDataService } from '@dspace/core/data/dspace-object-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { RequestEntryState } from '@dspace/core/data/request-entry-state.model';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { RouteService } from '@dspace/core/services/route.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { FacetValues } from '@dspace/core/shared/search/models/facet-values.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchFilterConfig } from '@dspace/core/shared/search/models/search-filter-config.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { HALEndpointServiceStub } from '@dspace/core/testing/hal-endpoint-service.stub';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { getMockRemoteDataBuildService } from '@dspace/core/testing/remote-data-build.service.mock';
import { getMockRequestService } from '@dspace/core/testing/request.service.mock';
import { routeServiceStub } from '@dspace/core/testing/route-service.stub';
import { SearchConfigurationServiceStub } from '@dspace/core/testing/search-configuration-service.stub';
import { Angulartics2 } from 'angulartics2';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { SearchService } from './search.service';
import { SearchConfigurationService } from './search-configuration.service';
import anything = jasmine.anything;
import SpyObj = jasmine.SpyObj;
import { Component } from '@angular/core';

@Component({
  template: '',
  standalone: true,
  imports: [],
})
class DummyComponent {
}

describe('SearchService', () => {
  let service: SearchService;

  let halService: HALEndpointServiceStub;
  let paginationService: PaginationServiceStub;
  let remoteDataBuildService: RemoteDataBuildService;
  let requestService: SpyObj<RequestService>;
  let routeService: RouteService;
  let searchConfigService: SearchConfigurationServiceStub;

  let testScheduler: TestScheduler;
  let msToLive: number;
  let remoteDataTimestamp: number;

  const envConfig = {
    rest: {
      baseUrl: 'https://rest.com/server',
    },
  };

  beforeEach(() => {
    halService = new HALEndpointServiceStub(envConfig.rest.baseUrl);
    paginationService = new PaginationServiceStub();
    remoteDataBuildService = getMockRemoteDataBuildService();
    requestService = getMockRequestService();
    searchConfigService = new SearchConfigurationServiceStub();

    initTestData();

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: RouteService, useValue: routeServiceStub },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: remoteDataBuildService },
        { provide: HALEndpointService, useValue: halService },
        { provide: DSpaceObjectDataService, useValue: {} },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigService },
        { provide: Angulartics2, useValue: {} },
        SearchService,
      ],
    });
    service = TestBed.inject(SearchService);
    routeService = TestBed.inject(RouteService);
  });

  function initTestData(): void {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    msToLive = 15 * 60 * 1000;
    // The response's lastUpdated equals the time of 60 seconds after the test started, ensuring they are not perceived
    // as cached values.
    remoteDataTimestamp = new Date().getTime() + 60 * 1000;
  }

  describe('setViewMode', () => {
    it('should call the navigate method on the Router with view mode list parameter as a parameter when setViewMode is called', () => {
      service.setViewMode(ViewMode.ListElement);

      expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('test-id', ['/search'], { page: 1 }, { view: ViewMode.ListElement });
    });

    it('should call the navigate method on the Router with view mode grid parameter as a parameter when setViewMode is called', () => {
      service.setViewMode(ViewMode.GridElement);

      expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('test-id', ['/search'], { page: 1 }, { view: ViewMode.GridElement });
    });
  });

  describe('getViewMode', () => {
    it('should return list view mode', () => {
      testScheduler.run(({ expectObservable }) => {
        expectObservable(service.getViewMode()).toBe('(a|)', {
          a: ViewMode.ListElement,
        });
      });
    });

    it('should return ViewMode.List when the viewMode is set to ViewMode.List in the ActivatedRoute', () => {
      testScheduler.run(({ expectObservable }) => {
        spyOn(routeService, 'getQueryParamMap').and.returnValue(of(new Map([
          ['view', ViewMode.ListElement],
        ])));

        expectObservable(service.getViewMode()).toBe('(a|)', {
          a: ViewMode.ListElement,
        });
      });
    });

    it('should return ViewMode.Grid when the viewMode is set to ViewMode.Grid in the ActivatedRoute', () => {
      testScheduler.run(({ expectObservable }) => {
        spyOn(routeService, 'getQueryParamMap').and.returnValue(of(new Map([
          ['view', ViewMode.GridElement],
        ])));

        expectObservable(service.getViewMode()).toBe('(a|)', {
          a: ViewMode.GridElement,
        });
      });
    });
  });

  describe('search', () => {
    let remoteDataMocks: Record<string, RemoteData<SearchObjects<any>>>;

    beforeEach(() => {
      remoteDataMocks = {
        RequestPending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.RequestPending, undefined, undefined, undefined),
        ResponsePending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.ResponsePending, undefined, undefined, undefined),
        Success: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.Success, undefined, new SearchObjects(), 200),
        SuccessStale: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.SuccessStale, undefined, new SearchObjects(), 200),
      };
    });

    describe('when useCachedVersionIfAvailable is true', () => {
      it(`should emit a cached completed RemoteData immediately, and keep emitting if it gets re-requested`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(remoteDataBuildService, 'buildFromHref').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          }));
          const expected = 'a-b-c-d-e';
          const values = {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.search(undefined, msToLive, true)).toBe(expected, values);
        });
      });
    });

    describe('when useCachedVersionIfAvailable is false', () => {
      it('should not emit a cached completed RemoteData', () => {
        // Old cached value from 1 minute before the test started
        const oldCachedSucceededData: RemoteData<SearchObjects<any>> = Object.assign(new SearchObjects(), remoteDataMocks.Success, {
          timeCompleted: remoteDataTimestamp - 2 * 60 * 1000,
          lastUpdated: remoteDataTimestamp - 2 * 60 * 1000,
        });
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(remoteDataBuildService, 'buildFromHref').and.returnValue(cold('a-b-c-d-e', {
            a: oldCachedSucceededData,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          }));
          const expected = '--b-c-d-e';
          const values = {
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.search(undefined, msToLive, false)).toBe(expected, values);
        });
      });

      it('should emit the first completed RemoteData since the request was made', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(remoteDataBuildService, 'buildFromHref').and.returnValue(cold('a-b', {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.SuccessStale,
          }));
          const expected = 'a-b';
          const values = {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.SuccessStale,
          };
          expectObservable(service.search(undefined, msToLive, false)).toBe(expected, values);
        });
      });
    });

    it('should call getEndpoint on the halService', () => {
      spyOn(halService, 'getEndpoint').and.callThrough();

      service.search(new PaginatedSearchOptions({})).subscribe();

      expect(halService.getEndpoint).toHaveBeenCalled();
    });

    it('should send out the request on the request service', () => {
      service.search(new PaginatedSearchOptions({})).subscribe();

      expect(requestService.send).toHaveBeenCalled();
    });

    it('should call getByHref on the request service with the correct request url', () => {
      spyOn(remoteDataBuildService, 'buildFromHref').and.callThrough();

      service.search(new PaginatedSearchOptions({})).subscribe();

      expect(remoteDataBuildService.buildFromHref).toHaveBeenCalledWith(envConfig.rest.baseUrl + '/discover/search/objects');
    });
  });

  describe('getFacetValuesFor', () => {
    let remoteDataMocks: Record<string, RemoteData<FacetValues>>;
    let filterConfig: SearchFilterConfig;

    beforeEach(() => {
      remoteDataMocks = {
        RequestPending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.RequestPending, undefined, undefined, undefined),
        ResponsePending: new RemoteData(undefined, msToLive, remoteDataTimestamp, RequestEntryState.ResponsePending, undefined, undefined, undefined),
        Success: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.Success, undefined, new FacetValues(), 200),
        SuccessStale: new RemoteData(remoteDataTimestamp, msToLive, remoteDataTimestamp, RequestEntryState.SuccessStale, undefined, new FacetValues(), 200),
      };
      filterConfig = new SearchFilterConfig();
      filterConfig._links = {
        self: {
          href: envConfig.rest.baseUrl,
        },
      };
    });

    describe('when useCachedVersionIfAvailable is true', () => {
      it(`should emit a cached completed RemoteData immediately, and keep emitting if it gets re-requested`, () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(remoteDataBuildService, 'buildFromHref').and.returnValue(cold('a-b-c-d-e', {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          }));
          const expected = 'a-b-c-d-e';
          const values = {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.getFacetValuesFor(filterConfig, 1, undefined, undefined, true)).toBe(expected, values);
        });
      });
    });

    describe('when useCachedVersionIfAvailable is false', () => {
      it('should not emit a cached completed RemoteData', () => {
        // Old cached value from 1 minute before the test started
        const oldCachedSucceededData: RemoteData<FacetValues> = Object.assign(new FacetValues(), remoteDataMocks.Success, {
          timeCompleted: remoteDataTimestamp - 2 * 60 * 1000,
          lastUpdated: remoteDataTimestamp - 2 * 60 * 1000,
        });
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(remoteDataBuildService, 'buildFromHref').and.returnValue(cold('a-b-c-d-e', {
            a: oldCachedSucceededData,
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          }));
          const expected = '--b-c-d-e';
          const values = {
            b: remoteDataMocks.RequestPending,
            c: remoteDataMocks.ResponsePending,
            d: remoteDataMocks.Success,
            e: remoteDataMocks.SuccessStale,
          };

          expectObservable(service.getFacetValuesFor(filterConfig, 1, undefined, undefined, false)).toBe(expected, values);
        });
      });

      it('should emit the first completed RemoteData since the request was made', () => {
        testScheduler.run(({ cold, expectObservable }) => {
          spyOn(remoteDataBuildService, 'buildFromHref').and.returnValue(cold('a-b', {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.SuccessStale,
          }));
          const expected = 'a-b';
          const values = {
            a: remoteDataMocks.Success,
            b: remoteDataMocks.SuccessStale,
          };
          expectObservable(service.getFacetValuesFor(filterConfig, 1, undefined, undefined, false)).toBe(expected, values);
        });
      });
    });

    it('should encode the filterQuery', () => {
      spyOn((service as any), 'request').and.callThrough();

      service.getFacetValuesFor(filterConfig, 1, undefined, 'filter&Query');

      expect((service as any).request).toHaveBeenCalledWith(anything(), envConfig.rest.baseUrl + '?page=0&size=5&prefix=filter%26Query');
    });
  });
});
