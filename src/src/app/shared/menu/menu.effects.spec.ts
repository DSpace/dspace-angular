import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  cold,
  hot,
} from 'jasmine-marbles';
import { Observable } from 'rxjs';

import {
  StoreAction,
  StoreActionTypes,
} from '../../store.actions';
import { ReinitMenuAction } from './menu.actions';
import { MenuEffects } from './menu.effects';

describe('MenuEffects', () => {
  let menuEffects: MenuEffects;
  let actions: Observable<any>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuEffects,
        provideMockActions(() => actions),
      ],
    });
  }));

  beforeEach(() => {
    menuEffects = TestBed.inject(MenuEffects);
  });

  describe('reinitDSOMenus', () => {
    describe('When a REHYDRATE action is triggered', () => {
      let action;
      beforeEach(() => {
        action = new StoreAction(StoreActionTypes.REHYDRATE, null);
      });
      it('should return a ReinitMenuAction', () => {
        actions = hot('--a-', { a: action });
        const expected = cold('--b-', { b: new ReinitMenuAction });

        expect(menuEffects.reinitDSOMenus).toBeObservable(expected);
      });
    });
  });


});
