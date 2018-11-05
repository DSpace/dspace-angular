import { TestBed } from '@angular/core/testing';
import { NavbarEffects } from './navbar.effects';
import { NavbarCollapseAction } from './navbar.actions';
import { HostWindowResizeAction } from '../shared/host-window.actions';
import { Observable } from 'rxjs/Observable';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import * as fromRouter from '@ngrx/router-store';

describe('NavbarEffects', () => {
  let navbarEffects: NavbarEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavbarEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    navbarEffects = TestBed.get(NavbarEffects);
  });

  describe('resize$', () => {

    it('should return a COLLAPSE action in response to a RESIZE action', () => {
      actions = hot('--a-', { a: new HostWindowResizeAction(800, 600) });

      const expected = cold('--b-', { b: new NavbarCollapseAction() });

      expect(navbarEffects.resize$).toBeObservable(expected);
    });

  });

  describe('routeChange$', () => {

    it('should return a COLLAPSE action in response to an UPDATE_LOCATION action', () => {
      actions = hot('--a-', { a: { type: fromRouter.ROUTER_NAVIGATION } });

      const expected = cold('--b-', { b: new NavbarCollapseAction() });

      expect(navbarEffects.routeChange$).toBeObservable(expected);
    });

  });
});
