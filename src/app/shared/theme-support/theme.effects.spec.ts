import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { BASE_THEME_NAME } from '@dspace/config/theme.config';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  cold,
  hot,
} from 'jasmine-marbles';

import { SetThemeAction } from './theme.actions';
import { ThemeEffects } from './theme.effects';

describe('ThemeEffects', () => {
  let themeEffects: ThemeEffects;
  let initialState;

  const appConfigMock = {
    themes: [
      {
        name: 'full-item-page-theme',
        regex: 'items/aa6c6c83-3a83-4953-95d1-2bc2e67854d2/full',
      },
      {
        name: 'error-theme',
        regex: 'collections/aaaa.*',
      },
      {
        name: 'handle-theme',
        handle: '10673/1233',
      },
      {
        name: 'regex-theme',
        regex: 'collections\/e8043bc2.*',
      },
      {
        name: 'uuid-theme',
        uuid: '0958c910-2037-42a9-81c7-dca80e3892b4',
      },
      {
        name: 'base',
      },
    ],
  };

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
        { provide: APP_CONFIG, useValue: appConfigMock },
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
