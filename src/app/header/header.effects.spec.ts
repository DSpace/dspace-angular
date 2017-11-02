import { TestBed } from '@angular/core/testing';
import { HeaderEffects } from './header.effects';
import { HeaderCollapseAction } from './header.actions';
import { HostWindowResizeAction } from '../shared/host-window.actions';
import { Observable } from 'rxjs/Observable';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import * as fromRouter from '@ngrx/router-store';
import { UniversalService } from '../universal.service';

describe('HeaderEffects', () => {
  let headerEffects: HeaderEffects;
  let actions: Observable<any>;
  const universalServiceStub = {
    get isReplaying() {
      return false
    }
  } as UniversalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeaderEffects,
        provideMockActions(() => actions),
        { provide: UniversalService, useValue: universalServiceStub }
      ],
    });

    headerEffects = TestBed.get(HeaderEffects);
  });

  describe('while UniversalService is replaying', () => {
    beforeEach(() => {
      spyOn((headerEffects as any).universalService, 'isReplaying').and.returnValue(true)
    });

    describe('resize$', () => {
      it('shouldn\'t do anything', () => {
        actions = hot('--a-', { a: new HostWindowResizeAction(800, 600) });

        const expected = cold('----');

        expect(headerEffects.resize$).toBeObservable(expected);

      });
    });

    describe('routeChange$', () => {
      it('shouldn\'t do anything', () => {
        actions = hot('--a-', { a: { type: fromRouter.ROUTER_NAVIGATION } });

        const expected = cold('----');

        expect(headerEffects.resize$).toBeObservable(expected);

      });
    });
  });

  describe('otherwise', () => {
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

    })
  });
});
