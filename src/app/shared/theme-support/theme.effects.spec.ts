import { ThemeEffects } from './theme.effects';
import { of as observableOf } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { LinkService } from '../../core/cache/builders/link.service';
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
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$
} from '../remote-data.utils';
import { BASE_THEME_NAME } from './theme.constants';

/**
 * LinkService able to mock recursively resolving DSO parent links
 * Every time resolveLinkWithoutAttaching is called, it returns the next object in the array of ancestorDSOs until
 * none are left, after which it returns a no-content remote-date
 */
class MockLinkService {
  index = -1;

  constructor(private ancestorDSOs: DSpaceObject[]) {
  }

  resolveLinkWithoutAttaching() {
    if (this.index >= this.ancestorDSOs.length - 1) {
      return createNoContentRemoteDataObject$();
    } else {
      this.index++;
      return createSuccessfulRemoteDataObject$(this.ancestorDSOs[this.index]);
    }
  }
}

describe('ThemeEffects', () => {
  let themeEffects: ThemeEffects;
  let linkService: LinkService;
  let initialState;

  let ancestorDSOs: DSpaceObject[];

  function init() {
    ancestorDSOs = [
      Object.assign(new Collection(), {
        type: COLLECTION.value,
        uuid: 'collection-uuid',
        _links: { owningCommunity: { href: 'owning-community-link' } }
      }),
      Object.assign(new Community(), {
        type: COMMUNITY.value,
        uuid: 'sub-community-uuid',
        _links: { parentCommunity: { href: 'parent-community-link' } }
      }),
      Object.assign(new Community(), {
        type: COMMUNITY.value,
        uuid: 'top-community-uuid',
      }),
    ];
    linkService = new MockLinkService(ancestorDSOs) as any;
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
        { provide: LinkService, useValue: linkService },
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

    it('should set the default theme', () => {
      const expected = cold('--b-', {
        b: new SetThemeAction(BASE_THEME_NAME)
      });

      expect(themeEffects.initTheme$).toBeObservable(expected);
    });
  });

  describe('updateThemeOnRouteChange$', () => {
    const url = '/test/route';
    const dso = Object.assign(new Community(), {
      type: COMMUNITY.value,
      uuid: '0958c910-2037-42a9-81c7-dca80e3892b4',
    });

    function spyOnPrivateMethods() {
      spyOn((themeEffects as any), 'getAncestorDSOs').and.returnValue(() => observableOf([dso]));
      spyOn((themeEffects as any), 'matchThemeToDSOs').and.returnValue(new Theme({ name: 'custom' }));
      spyOn((themeEffects as any), 'getActionForMatch').and.returnValue(new SetThemeAction('custom'));
    }

    describe('when a resolved action is present', () => {
      beforeEach(() => {
        setupEffectsWithActions(
          hot('--ab-', {
            a: {
              type: ROUTER_NAVIGATED,
              payload: { routerState: { url } },
            },
            b: {
              type: ResolverActionTypes.RESOLVED,
              payload: { url, dso },
            }
          })
        );
        spyOnPrivateMethods();
      });

      it('should set the theme it receives from the DSO', () => {
        const expected = cold('--b-', {
          b: new SetThemeAction('custom')
        });

        expect(themeEffects.updateThemeOnRouteChange$).toBeObservable(expected);
      });
    });

    describe('when no resolved action is present', () => {
      beforeEach(() => {
        setupEffectsWithActions(
          hot('--a-', {
            a: {
              type: ROUTER_NAVIGATED,
              payload: { routerState: { url } },
            },
          })
        );
        spyOnPrivateMethods();
      });

      it('should set the theme it receives from the route url', () => {
        const expected = cold('--b-', {
          b: new SetThemeAction('custom')
        });

        expect(themeEffects.updateThemeOnRouteChange$).toBeObservable(expected);
      });
    });

    describe('when no themes are present', () => {
      beforeEach(() => {
        setupEffectsWithActions(
          hot('--a-', {
            a: {
              type: ROUTER_NAVIGATED,
              payload: { routerState: { url } },
            },
          })
        );
        (themeEffects as any).themes = [];
      });

      it('should return an empty action', () => {
        const expected = cold('--b-', {
          b: new NoOpAction()
        });

        expect(themeEffects.updateThemeOnRouteChange$).toBeObservable(expected);
      });
    });
  });

  describe('private functions', () => {
    beforeEach(() => {
      setupEffectsWithActions(hot('-', {}));
    });

    describe('getActionForMatch', () => {
      it('should return a SET action if the new theme differs from the current theme', () => {
        const theme = new Theme({ name: 'new-theme' });
        expect((themeEffects as any).getActionForMatch(theme, 'old-theme')).toEqual(new SetThemeAction('new-theme'));
      });

      it('should return an empty action if the new theme equals the current theme', () => {
        const theme = new Theme({ name: 'old-theme' });
        expect((themeEffects as any).getActionForMatch(theme, 'old-theme')).toEqual(new NoOpAction());
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

    describe('getAncestorDSOs', () => {
      it('should return an array of the provided DSO and its ancestors', (done) => {
        const dso = Object.assign(new Item(), {
          type: ITEM.value,
          uuid: 'item-uuid',
          _links: { owningCollection: { href: 'owning-collection-link' } },
        });

        observableOf(dso).pipe(
          (themeEffects as any).getAncestorDSOs()
        ).subscribe((result) => {
          expect(result).toEqual([dso, ...ancestorDSOs]);
          done();
        });
      });

      it('should return an array of just the provided DSO if it doesn\'t have any parents', (done) => {
        const dso = {
          type: ITEM.value,
          uuid: 'item-uuid',
        };

        observableOf(dso).pipe(
          (themeEffects as any).getAncestorDSOs()
        ).subscribe((result) => {
          expect(result).toEqual([dso]);
          done();
        });
      });
    });
  });
});
