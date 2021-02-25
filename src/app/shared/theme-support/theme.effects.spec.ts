import { ThemeEffects } from './theme.effects';
import { Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { LinkService } from '../../core/cache/builders/link.service';
import { getMockLinkService } from '../mocks/link-service.mock';
import { cold, hot } from 'jasmine-marbles';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { SetThemeAction } from './theme.actions';
import { Theme } from '../../../config/theme.model';
import { provideMockStore } from '@ngrx/store/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { ResolverActionTypes } from '../../core/resolving/resolver.actions';
import { Community } from '../../core/shared/community.model';
import { COMMUNITY } from '../../core/shared/community.resource-type';
import { NoOpAction } from '../ngrx/no-op.action';
import { ITEM } from '../../core/shared/item.resource-type';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { Collection } from '../../core/shared/collection.model';
import { COLLECTION } from '../../core/shared/collection.resource-type';
import { BASE_THEME_NAME } from './theme.constants';

describe('ThemeEffects', () => {
  let themeEffects: ThemeEffects;
  let linkService: LinkService;
  let initialState;
  let actions: Observable<any>;

  function init() {
    linkService = getMockLinkService();
    initialState = {
      currentTheme: 'custom',
    };
  }

  beforeEach(() => {
    init();
    TestBed.configureTestingModule({
      providers: [
        ThemeEffects,
        { provide: LinkService, useValue: linkService },
        provideMockStore({ initialState }),
        provideMockActions(() => actions)
      ]
    });

    themeEffects = TestBed.inject(ThemeEffects);
  });

  describe('initTheme$', () => {
    it('should set the default theme', () => {
      actions = hot('--a-', {
        a: {
          type: ROOT_EFFECTS_INIT
        }
      });

      const expected = cold('--b-', {
        b: new SetThemeAction(BASE_THEME_NAME)
      });

      expect(themeEffects.initTheme$).toBeObservable(expected);
    });
  });

  // TODO: Fix test
  xdescribe('updateThemeOnRouteChange$', () => {
    it('test', () => {
      const url = '/test/route';
      const dso = Object.assign(new Community(), {
        type: COMMUNITY.value,
        uuid: '0958c910-2037-42a9-81c7-dca80e3892b4',
      });
      actions = hot('--ab-', {
        a: {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url } },
        },
        b: {
          type: ResolverActionTypes.RESOLVED,
          payload: { url, dso },
        }
      });

      const expected = cold('--b-', {
        b: new SetThemeAction('Publications community (uuid)')
      });

      expect(themeEffects.initTheme$).toBeObservable(expected);
    });
  });

  describe('getActionForMatch', () => {
    it('should return a SET action if the name doesn\'t match', () => {
      const theme = new Theme({ name: 'new-theme' });
      expect((themeEffects as any).getActionForMatch(theme, 'not-matching')).toEqual(new SetThemeAction('new-theme'));
    });

    it('should return an empty action if the name matches', () => {
      const theme = new Theme({ name: 'new-theme' });
      expect((themeEffects as any).getActionForMatch(theme, 'new-theme')).toEqual(new NoOpAction());
    });
  });

  describe('matchThemeToDSOs', () => {
    let themes: Theme[];
    let nonMatchingTheme: Theme;
    let itemMatchingTheme: Theme;
    let communityMatchingTheme: Theme;
    let dsos: DSpaceObject[];

    beforeEach(() => {
      nonMatchingTheme = Object.assign(new Theme({ name: 'non-matching-theme' }), {
        matches: () => false
      });
      itemMatchingTheme = Object.assign(new Theme({ name: 'item-matching-theme' }), {
        matches: (url, dso) => (dso as any).type === ITEM.value
      });
      communityMatchingTheme = Object.assign(new Theme({ name: 'community-matching-theme' }), {
        matches: (url, dso) => (dso as any).type === COMMUNITY.value
      });
      dsos = [
        Object.assign(new Item(), {
          type: ITEM.value,
          uuid: 'item-uuid',
        }),
        Object.assign(new Collection(), {
          type: COLLECTION.value,
          uuid: 'collection-uuid',
        }),
        Object.assign(new Community(), {
          type: COMMUNITY.value,
          uuid: 'community-uuid',
        }),
      ];
    });

    describe('when no themes match any of the DSOs', () => {
      beforeEach(() => {
        themes = [ nonMatchingTheme ];
        themeEffects.themes = themes;
      });

      it('should return undefined', () => {
        expect((themeEffects as any).matchThemeToDSOs(dsos, '')).toBeUndefined();
      });
    });

    describe('when one of the themes match a DSOs', () => {
      beforeEach(() => {
        themes = [ nonMatchingTheme, itemMatchingTheme ];
        themeEffects.themes = themes;
      });

      it('should return the matching theme', () => {
        expect((themeEffects as any).matchThemeToDSOs(dsos, '')).toEqual(itemMatchingTheme);
      });
    });

    describe('when multiple themes match some of the DSOs', () => {
      it('should return the first matching theme', () => {
        themes = [ nonMatchingTheme, itemMatchingTheme, communityMatchingTheme ];
        themeEffects.themes = themes;
        expect((themeEffects as any).matchThemeToDSOs(dsos, '')).toEqual(itemMatchingTheme);

        themes = [ nonMatchingTheme, communityMatchingTheme, itemMatchingTheme ];
        themeEffects.themes = themes;
        expect((themeEffects as any).matchThemeToDSOs(dsos, '')).toEqual(communityMatchingTheme);
      });
    });
  });
});
