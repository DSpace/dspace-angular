import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import * as fromRouter from '@ngrx/router-store';
import { SidebarCollapseAction } from './sidebar.actions';
import { SidebarEffects } from './sidebar-effects.service';

describe('SidebarEffects', () => {
  let sidebarEffects: SidebarEffects;
  let actions: Observable<any>;
  const dummyURL = 'http://f4fb15e2-1bd3-4e63-8d0d-486ad8bc714a';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SidebarEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    sidebarEffects = TestBed.get(SidebarEffects);
  });

  describe('routeChange$', () => {

    it('should return a COLLAPSE action in response to an UPDATE_LOCATION action to a new route', () => {
      actions = hot('--a-', { a: { type: fromRouter.ROUTER_NAVIGATION, payload: {routerState: {url: dummyURL}} } });

      const expected = cold('--b-', { b: new SidebarCollapseAction() });

      expect(sidebarEffects.routeChange$).toBeObservable(expected);
    });
  });
});
