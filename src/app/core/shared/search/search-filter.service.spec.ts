import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { FilterType } from '../../../shared/search/models/filter-type.model';
import { SearchFilterConfig } from '../../../shared/search/models/search-filter-config.model';
import { SearchOptions } from '../../../shared/search/models/search-options.model';
import {
  SearchFilterCollapseAction,
  SearchFilterDecrementPageAction,
  SearchFilterExpandAction,
  SearchFilterIncrementPageAction,
  SearchFilterInitializeAction,
  SearchFilterResetPageAction,
  SearchFilterToggleAction,
} from '../../../shared/search/search-filters/search-filter/search-filter.actions';
import { SearchFiltersState } from '../../../shared/search/search-filters/search-filter/search-filter.reducer';
import { routeServiceStub } from '../../../shared/testing/route-service.stub';
import { SearchServiceStub } from '../../../shared/testing/search-service.stub';
import {
  SortDirection,
  SortOptions,
} from '../../cache/models/sort-options.model';
import { RouteService } from '../../services/route.service';
import { SearchService } from './search.service';
import { SearchFilterService } from './search-filter.service';

describe('SearchFilterService', () => {
  let service: SearchFilterService;
  const filterName1 = 'test name';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    filterType: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
  });

  const value1 = 'random value';

  let searchService: SearchServiceStub;
  const store: Store<SearchFiltersState> = jasmine.createSpyObj('store', {
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    dispatch: {},
    /* eslint-enable no-empty,@typescript-eslint/no-empty-function */
    select: of(true),
  });

  beforeEach(waitForAsync(() => {
    searchService = new SearchServiceStub();

    TestBed.configureTestingModule({
      providers: [
        SearchFilterService,
        { provide: SearchService, useValue: searchService },
        { provide: Store, useValue: store },
        { provide: RouteService, useValue: routeServiceStub },
      ],
    });

    service = TestBed.inject(SearchFilterService);
  }));

  describe('when the initializeFilter method is triggered', () => {
    beforeEach(() => {
      service.initializeFilter(mockFilterConfig);
    });

    it('SearchFilterInitializeAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterInitializeAction(mockFilterConfig));
    });
  });

  describe('when the collapse method is triggered', () => {
    beforeEach(() => {
      service.collapse(mockFilterConfig.name);
    });

    it('SearchFilterCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterCollapseAction(mockFilterConfig.name));
    });

  });

  describe('when the toggle method is triggered', () => {
    beforeEach(() => {
      service.toggle(mockFilterConfig.name);
    });

    it('SearchFilterInitialExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterToggleAction(mockFilterConfig.name));
    });
  });

  describe('when the decreasePage method is triggered', () => {
    beforeEach(() => {
      service.decrementPage(mockFilterConfig.name);
    });

    it('SearchFilterDecrementPageAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterDecrementPageAction(mockFilterConfig.name));
    });

  });

  describe('when the increasePage method is triggered', () => {
    beforeEach(() => {
      service.incrementPage(mockFilterConfig.name);
    });

    it('SearchFilterCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterIncrementPageAction(mockFilterConfig.name));
    });

  });

  describe('when the resetPage method is triggered', () => {
    beforeEach(() => {
      service.resetPage(mockFilterConfig.name);
    });

    it('SearchFilterDecrementPageAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterResetPageAction(mockFilterConfig.name));
    });

  });

  describe('when the expand method is triggered', () => {
    beforeEach(() => {
      service.expand(mockFilterConfig.name);
    });

    it('SidebarExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterExpandAction(mockFilterConfig.name));
    });
  });

  describe('when the isFilterActiveWithValue method is called', () => {
    beforeEach(() => {
      spyOn(routeServiceStub, 'hasQueryParamWithValue');
      service.isFilterActiveWithValue(mockFilterConfig.paramName, value1);
    });

    it('should call hasQueryParamWithValue on the route service with the same parameters', () => {
      expect(routeServiceStub.hasQueryParamWithValue).toHaveBeenCalledWith(mockFilterConfig.paramName, value1);
    });
  });

  describe('when the isFilterActive method is called', () => {
    beforeEach(() => {
      spyOn(routeServiceStub, 'hasQueryParam');
      service.isFilterActive(mockFilterConfig.paramName);
    });

    it('should call hasQueryParam on the route service with the same parameters', () => {
      expect(routeServiceStub.hasQueryParam).toHaveBeenCalledWith(mockFilterConfig.paramName);
    });
  });

  describe('when the getCurrentScope method is called', () => {
    beforeEach(() => {
      spyOn(routeServiceStub, 'getQueryParameterValue');
      service.getCurrentScope();
    });

    it('should call getQueryParameterValue on the route service with scope', () => {
      expect(routeServiceStub.getQueryParameterValue).toHaveBeenCalledWith('scope');
    });
  });

  describe('when the getCurrentQuery method is called', () => {
    beforeEach(() => {
      spyOn(routeServiceStub, 'getQueryParameterValue');
      service.getCurrentQuery();
    });

    it('should call getQueryParameterValue on the route service with query', () => {
      expect(routeServiceStub.getQueryParameterValue).toHaveBeenCalledWith('query');
    });
  });

  describe('when the getCurrentPagination method is called', () => {
    let result;
    const mockReturn = 5;

    beforeEach(() => {
      spyOn(routeServiceStub, 'getQueryParameterValue').and.returnValue(of(mockReturn));
      result = service.getCurrentPagination();
    });

    it('should call getQueryParameterValue on the route service with page', () => {
      expect(routeServiceStub.getQueryParameterValue).toHaveBeenCalledWith('page');
    });

    it('should call getQueryParameterValue on the route service with pageSize', () => {
      expect(routeServiceStub.getQueryParameterValue).toHaveBeenCalledWith('pageSize');
    });

    it('should return an observable containing the correct pagination', () => {
      result.subscribe((pagination) => {
        expect(pagination.currentPage).toBe(mockReturn);
        expect(pagination.pageSize).toBe(mockReturn);
      });
    });
  });

  describe('when the getCurrentSort method is called', () => {
    let result;
    const field = 'author';
    const direction = SortDirection.ASC;

    beforeEach(() => {
      spyOn(routeServiceStub, 'getQueryParameterValue').and.returnValue(of(undefined));
      result = service.getCurrentSort(new SortOptions(field, direction));
    });

    it('should call getQueryParameterValue on the route service with sortDirection', () => {
      expect(routeServiceStub.getQueryParameterValue).toHaveBeenCalledWith('sortDirection');
    });

    it('should call getQueryParameterValue on the route service with sortField', () => {
      expect(routeServiceStub.getQueryParameterValue).toHaveBeenCalledWith('sortField');
    });

    it('should return an observable containing the correct sortOptions', () => {
      result.subscribe((sort) => {
        expect(sort.field).toBe(field);
        expect(sort.direction).toBe(direction);
      });
    });
  });

  describe('when the getCurrentFilters method is called', () => {
    beforeEach(() => {
      spyOn(routeServiceStub, 'getQueryParamsWithPrefix');
      service.getCurrentFilters();
    });

    it('should call getQueryParamsWithPrefix on the route service with prefix \'f.\'', () => {
      expect(routeServiceStub.getQueryParamsWithPrefix).toHaveBeenCalledWith('f.');
    });
  });

  describe('when the getCurrentView method is called', () => {
    beforeEach(() => {
      spyOn(routeServiceStub, 'getQueryParameterValue');
      service.getCurrentView();
    });

    it('should call getQueryParameterValue on the route service with view', () => {
      expect(routeServiceStub.getQueryParameterValue).toHaveBeenCalledWith('view');
    });
  });


  describe('when findSuggestions is called with query \'test\'', () => {
    const query = 'test';
    const searchOptions = new SearchOptions({});

    beforeEach(() => {
      spyOn(searchService, 'getFacetValuesFor').and.returnValue(of());
      service.findSuggestions(mockFilterConfig, searchOptions, query);
    });

    it('should call getFacetValuesFor on the component\'s SearchService with the right query', () => {
      expect(searchService.getFacetValuesFor).toHaveBeenCalledWith(mockFilterConfig, 1, searchOptions, query);
    });
  });
});
