import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { environment } from '../../../../environments/environment.test';
import { getMockRemoteDataBuildService } from '../../../shared/mocks/remote-data-build.service.mock';
import { getMockRequestService } from '../../../shared/mocks/request.service.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { FilterType } from '../../../shared/search/models/filter-type.model';
import { SearchFilterConfig } from '../../../shared/search/models/search-filter-config.model';
import { SearchFacetDataService } from '../../../shared/search/services/search-facet.data.service';
import { HALEndpointServiceStub } from '../../../shared/testing/hal-endpoint-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { SearchConfigurationServiceStub } from '../../../shared/testing/search-configuration-service.stub';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { RemoteDataBuildService } from '../../cache/builders/remote-data-build.service';
import { DSpaceObjectDataService } from '../../data/dspace-object-data.service';
import { RequestService } from '../../data/request.service';
import { PaginationService } from '../../pagination/pagination.service';
import { RouteService } from '../../services/route.service';
import { HALEndpointService } from '../hal-endpoint.service';
import { ViewMode } from '../view-mode.model';
import { SearchService } from './search.service';
import { SearchConfigurationService } from './search-configuration.service';
import SpyObj = jasmine.SpyObj;
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../shared/search/models/paginated-search-options.model';
import { RequestParam } from '../../cache/models/request-param.model';

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
  let searchFacetService: SearchFacetDataService;

  let testScheduler: TestScheduler;
  let msToLive: number;
  let remoteDataTimestamp: number;

  beforeEach(() => {
    halService = new HALEndpointServiceStub(environment.rest.baseUrl);
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
