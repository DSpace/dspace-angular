import { TestBed } from '@angular/core/testing';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  cold,
  hot,
} from 'jasmine-marbles';

import { SetThemeAction } from './theme.actions';
import { BASE_THEME_NAME } from './theme.constants';
import { ThemeEffects } from './theme.effects';

describe('ThemeEffects', () => {
  let themeEffects: ThemeEffects;
  let initialState;

  function init() {
    initialState = {
      theme: {
        currentTheme: 'custom',
      },
    };
  }

  function setupEffectsWithActions(mockActions) {
    init();
    TestBed.configureTestingModule({
      providers: [
        ThemeEffects,
        provideMockStore({ initialState }),
        provideMockActions(() => mockActions),
      ],
    });

    themeEffects = TestBed.inject(ThemeEffects);
  }

  describe('initTheme$', () => {
    beforeEach(() => {
      setupEffectsWithActions(
        hot('--a-', {
          a: {
            type: ROOT_EFFECTS_INIT,
          },
        }),
      );
    });

    it('should set the default theme', () => {
      const expected = cold('--b-', {
        b: new SetThemeAction(BASE_THEME_NAME),
      });

      expect(themeEffects.initTheme$).toBeObservable(expected);
    });
  });
});
