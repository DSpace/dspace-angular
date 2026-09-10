import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { DSpaceObjectDataService } from '@dspace/core/data/dspace-object-data.service';
import { RequestService } from '@dspace/core/data/request.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { RouteService } from '@dspace/core/services/route.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { SearchFilterConfig } from '@dspace/core/shared/search/models/search-filter-config.model';
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
import SpyObj = jasmine.SpyObj;
import { RequestParam } from '@dspace/core/cache/models/request-param.model';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { FilterType } from '@dspace/core/shared/search/models/filter-type.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';

import { SearchFacetDataService } from './services/search-facet.data.service';

@Component({
  template: '',
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
  let searchFacetService: SearchFacetDataService;

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
    searchFacetService = jasmine.createSpyObj('searchFacetService', {
      findValues: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    });

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
        { provide: SearchFacetDataService, useValue: searchFacetService },
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

  describe('getFacetValuesFor', () => {
    let filterConfig: SearchFilterConfig;

    beforeEach(() => {
      filterConfig = new SearchFilterConfig();
      filterConfig.filter = 'mock-filter';
      filterConfig.filterType = FilterType.text;
      filterConfig.pageSize = 10;
    });

    it('should combine searchOptions with the requested page, query and filter config\'s page size', (done) => {
      service.getFacetValuesFor(filterConfig, 5, new PaginatedSearchOptions({ pagination: { id: 'mock-pagination', currentPage: 2, pageSize: 20, maxSize: 40 } as PaginationComponentOptions }), 'mock-query', true).subscribe(() => {
        expect(searchFacetService.findValues).toHaveBeenCalledWith('mock-filter', jasmine.objectContaining({
          // Page from method takes precedent over options
          currentPage: 5,
          // Page size from filter-config takes precedent over options
          elementsPerPage: 10,
          // Query is passed as a search-param with nam "prefix"
          searchParams: jasmine.arrayContaining([new RequestParam('prefix', 'mock-query')]),
        }), true);
        done();
      });
    });
  });
});
