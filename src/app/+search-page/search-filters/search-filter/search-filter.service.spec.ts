import { Observable } from 'rxjs/Observable';
import { SearchFilterService } from './search-filter.service';
import { Store } from '@ngrx/store';
import {
  SearchFilterCollapseAction, SearchFilterDecrementPageAction, SearchFilterExpandAction,
  SearchFilterIncrementPageAction,
  SearchFilterInitialCollapseAction, SearchFilterInitialExpandAction, SearchFilterResetPageAction,
  SearchFilterToggleAction
} from './search-filter.actions';
import { SearchFiltersState } from './search-filter.reducer';
import { SearchFilterConfig } from '../../search-service/search-filter-config.model';
import { FilterType } from '../../search-service/filter-type.model';
import { ActivatedRouteStub } from '../../../shared/testing/active-router-stub';

describe('SearchFilterService', () => {
  let service: SearchFilterService;
  const filterName1 = 'test name';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });
  const value1 = 'random value';
  // const value2 = 'another value';
  const store: Store<SearchFiltersState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });

  const routeServiceStub: any = {
    /* tslint:disable:no-empty */
    hasQueryParamWithValue: (param: string, value: string) => {
    },
    hasQueryParam: (param: string) => {
    },
    removeQueryParameterValue: (param: string, value: string) => {
    },
    addQueryParameterValue: (param: string, value: string) => {
    },
    getQueryParameterValues: (param: string) => {
      return Observable.of({});
    },
    getQueryParamsWithPrefix: (param: string) => {
      return Observable.of({});
    }
    /* tslint:enable:no-empty */
  };
  const activatedRoute: any = new ActivatedRouteStub();
  const searchServiceStub: any = {
    uiSearchRoute: '/search'
  };

  beforeEach(() => {
    service = new SearchFilterService(store, routeServiceStub);
  });

  describe('when the initialCollapse method is triggered', () => {
    beforeEach(() => {
      service.initialCollapse(mockFilterConfig.name);
    });

    it('SearchFilterInitialCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterInitialCollapseAction(mockFilterConfig.name));
    });
  });

  describe('when the initialExpand method is triggered', () => {
    beforeEach(() => {
      service.initialExpand(mockFilterConfig.name);
    });

    it('SearchFilterInitialExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterInitialExpandAction(mockFilterConfig.name));
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

    it('SearchSidebarExpandAction should be dispatched to the store', () => {
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

  describe('when the getSelectedValuesForFilter method is called', () => {
    beforeEach(() => {
      spyOn(routeServiceStub, 'getQueryParameterValues');
      service.getSelectedValuesForFilter(mockFilterConfig);
    });

    it('should call getQueryParameterValues on the route service with the same parameters', () => {
      expect(routeServiceStub.getQueryParameterValues).toHaveBeenCalledWith(mockFilterConfig.paramName);
    });
  });

});
