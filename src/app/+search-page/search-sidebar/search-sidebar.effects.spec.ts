import { TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';
import * as fromRouter from '@ngrx/router-store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { SearchSidebarCollapseAction } from './search-sidebar.actions';
import { SearchSidebarEffects } from './search-sidebar.effects';

describe('SearchSidebarEffects', () => {
  let sidebarEffects: SearchSidebarEffects;
  let actions: Observable<any>;
  const dummyURL = 'http://f4fb15e2-1bd3-4e63-8d0d-486ad8bc714a';

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

    it('should return a COLLAPSE action in response to an UPDATE_LOCATION action to a new route', () => {
      actions = hot('--a-', { a: { type: fromRouter.ROUTER_NAVIGATION, payload: {routerState: {url: dummyURL}} } });

      const expected = cold('--b-', { b: new SearchSidebarCollapseAction() });

      expect(sidebarEffects.routeChange$).toBeObservable(expected);
    });
  });
});
