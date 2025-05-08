import { ThemeEffects } from './theme.effects';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot } from 'jasmine-marbles';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';

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
        provideMockActions(() => mockActions)
      ]
    });

    themeEffects = TestBed.inject(ThemeEffects);
  }

  describe('initTheme$', () => {
    beforeEach(() => {
      setupEffectsWithActions(
        hot('--a-', {
          a: {
            type: ROOT_EFFECTS_INIT
          }
        })
      );
    });
  });
});
