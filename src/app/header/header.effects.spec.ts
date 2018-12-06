import { TestBed } from '@angular/core/testing';

import { provideMockActions } from '@ngrx/effects/testing';
import * as fromRouter from '@ngrx/router-store';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { HeaderCollapseAction } from './header.actions';
import { HeaderEffects } from './header.effects';
import { HostWindowResizeAction } from '../shared/host-window.actions';

describe('HeaderEffects', () => {
  let headerEffects: HeaderEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeaderEffects,
        provideMockActions(() => actions),
        // other providers
      ],
    });

    headerEffects = TestBed.get(HeaderEffects);
  });

  describe('resize$', () => {

    it('should return a COLLAPSE action in response to a RESIZE action', () => {
      actions = hot('--a-', { a: new HostWindowResizeAction(800, 600) });

      const expected = cold('--b-', { b: new HeaderCollapseAction() });

      expect(headerEffects.resize$).toBeObservable(expected);
    });

  });

  describe('routeChange$', () => {

    it('should return a COLLAPSE action in response to an UPDATE_LOCATION action', () => {
      actions = hot('--a-', { a: { type: fromRouter.ROUTER_NAVIGATION } });

      const expected = cold('--b-', { b: new HeaderCollapseAction() });

      expect(headerEffects.routeChange$).toBeObservable(expected);
    });

  });
});
