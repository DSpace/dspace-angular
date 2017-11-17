import { Observable } from 'rxjs/Observable';
import { SearchFilterService } from './search-filter.service';
import { Store } from '@ngrx/store';
import {
  SearchFilterCollapseAction, SearchFilterDecrementPageAction, SearchFilterExpandAction,
  SearchFilterIncrementPageAction,
  SearchFilterInitialCollapseAction, SearchFilterInitialExpandAction, SearchFilterToggleAction
} from './search-filter.actions';
import { SearchService } from '../../search-service/search.service';
import { SearchFiltersState } from './search-filter.reducer';
import { RouteService } from '../../../shared/route.service';

describe('SearchFilterService', () => {
  let service: SearchFilterService;
  const filterName1 = 'author';
  // const filterName2 = 'scope';
  const store: Store<SearchFiltersState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });
  const routeService = new RouteService(null);
  const searchService = new SearchService(null, null, null, null)

  beforeEach(() => {
    service = new SearchFilterService(store, routeService, searchService);
  }) ;

  describe('when the initialCollapse method is triggered', () => {
    beforeEach(() => {
      service.initialCollapse(filterName1);
    });

    it('SearchFilterInitialCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterInitialCollapseAction(filterName1));
    });
  });

  describe('when the initialExpand method is triggered', () => {
    beforeEach(() => {
      service.initialExpand(filterName1);
    });

    it('SearchFilterInitialExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterInitialExpandAction(filterName1));
    });
  });

  describe('when the collapse method is triggered', () => {
    beforeEach(() => {
      service.collapse(filterName1);
    });

    it('SearchFilterCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterCollapseAction(filterName1));
    });

  });

  describe('when the toggle method is triggered', () => {
    beforeEach(() => {
      service.toggle(filterName1);
    });

    it('SearchFilterInitialExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterToggleAction(filterName1));
    });
  });

  describe('when the decreasePage method is triggered', () => {
    beforeEach(() => {
      service.decreasePage(filterName1);
    });

    it('SearchFilterDecrementPageAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterDecrementPageAction(filterName1));
    });

  });

  describe('when the increasePage method is triggered', () => {
    beforeEach(() => {
      service.increasePage(filterName1);
    });

    it('SearchFilterCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterIncrementPageAction(filterName1));
    });

  });

  describe('when the expand method is triggered', () => {
    beforeEach(() => {
      service.expand(filterName1);
    });

    it('SearchSidebarExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchFilterExpandAction(filterName1));
    });
  });
});
