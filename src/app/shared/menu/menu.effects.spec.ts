import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { StoreActionTypes } from '@dspace/core/ngrx/type';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  cold,
  hot,
} from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { StoreAction } from '../../store.actions';
import { ReinitMenuAction } from './menu.actions';
import { MenuEffects } from './menu.effects';
import { MenuService } from './menu.service';
import { MenuServiceStub } from './menu-service.stub';

describe('MenuEffects', () => {
  let menuEffects: MenuEffects;
  let actions: Observable<any>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        MenuEffects,
        provideMockActions(() => actions),
        { provide: MenuService, useValue: new MenuServiceStub() },
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
