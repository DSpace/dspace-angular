import { TestBed } from '@angular/core/testing';
import { HeaderEffects } from './header.effects';
import { HeaderCollapseAction } from './header.actions';
import { HostWindowResizeAction } from '../shared/host-window.actions';
import { Observable } from 'rxjs/Observable';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import * as fromRouter from '@ngrx/router-store';

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
