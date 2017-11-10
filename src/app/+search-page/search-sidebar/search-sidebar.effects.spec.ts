import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import * as fromRouter from '@ngrx/router-store';
import { SearchSidebarCollapseAction } from './search-sidebar.actions';
import { SearchSidebarEffects } from './search-sidebar.effects';

describe('SearchSidebarEffects', () => {
  let sidebarEffects: SearchSidebarEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchSidebarEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    sidebarEffects = TestBed.get(SearchSidebarEffects);
  });

  describe('routeChange$', () => {

    it('should return a COLLAPSE action in response to an UPDATE_LOCATION action', () => {
      actions = hot('--a-', { a: { type: fromRouter.ROUTER_NAVIGATION } });

      const expected = cold('--b-', { b: new SearchSidebarCollapseAction() });

      expect(sidebarEffects.routeChange$).toBeObservable(expected);
    });

  });
});
