import {
  CommonModule,
  DOCUMENT,
} from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { LinkService } from '../../core/cache/builders/link.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { Collection } from '../../core/shared/collection.model';
import { COLLECTION } from '../../core/shared/collection.resource-type';
import { Community } from '../../core/shared/community.model';
import { COMMUNITY } from '../../core/shared/community.resource-type';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import { ITEM } from '../../core/shared/item.resource-type';
import { RouterMock } from '../mocks/router.mock';
import { NoOpAction } from '../ngrx/no-op.action';
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../remote-data.utils';
import { ConfigurationDataServiceStub } from '../testing/configuration-data.service.stub';
import { SetThemeAction } from './theme.actions';
import { Theme } from './theme.model';
import { ThemeService } from './theme.service';

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

describe('ThemeService', () => {
  let themeService: ThemeService;
  let linkService: LinkService;
  let configurationService: ConfigurationDataServiceStub;
  let initialState;

  let ancestorDSOs: DSpaceObject[];

  const mockCommunity = Object.assign(new Community(), {
    type: COMMUNITY.value,
    uuid: 'top-community-uuid',
  });

  function init() {
    ancestorDSOs = [
      Object.assign(new Collection(), {
        type: COLLECTION.value,
        uuid: 'collection-uuid',
        _links: { owningCommunity: { href: 'owning-community-link' } },
      }),
      Object.assign(new Community(), {
        type: COMMUNITY.value,
        uuid: 'sub-community-uuid',
        _links: { parentCommunity: { href: 'parent-community-link' } },
      }),
      mockCommunity,
    ];
    linkService = new MockLinkService(ancestorDSOs) as any;
    initialState = {
      theme: {
        currentTheme: 'custom',
      },
    };
    configurationService = new ConfigurationDataServiceStub();
  }

  function setupServiceWithActions(mockActions) {
    init();
    const mockDsoService = {
      findById: () => createSuccessfulRemoteDataObject$(mockCommunity),
    };
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
      ],
      providers: [
        ThemeService,
        { provide: LinkService, useValue: linkService },
        provideMockStore({ initialState }),
        provideMockActions(() => mockActions),
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: Router, useValue: new RouterMock() },
        { provide: ConfigurationDataService, useValue: configurationService },
      ],
    });

    themeService = TestBed.inject(ThemeService);
    spyOn((themeService as any).store, 'dispatch').and.stub();
  }

  describe('updateThemeOnRouteChange$', () => {
    const url = '/test/route';
    const dso = Object.assign(new Community(), {
      type: COMMUNITY.value,
      uuid: '0958c910-2037-42a9-81c7-dca80e3892b4',
    });

    function spyOnPrivateMethods() {
      spyOn((themeService as any), 'getAncestorDSOs').and.returnValue(() => observableOf([dso]));
      spyOn((themeService as any), 'matchThemeToDSOs').and.returnValue(observableOf(new Theme({ name: 'custom' })));
      spyOn((themeService as any), 'getActionForMatch').and.returnValue(new SetThemeAction('custom'));
    }

    describe('when no resolved action is present', () => {
      beforeEach(() => {
        setupServiceWithActions(
          hot('--a-', {
            a: {
              type: ROUTER_NAVIGATED,
              payload: { routerState: { url } },
            },
          }),
        );
        spyOnPrivateMethods();
      });

      it('should set the theme it receives from the route url', (done) => {
        themeService.updateThemeOnRouteChange$(url, {} as ActivatedRouteSnapshot).subscribe(() => {
          expect((themeService as any).store.dispatch).toHaveBeenCalledWith(new SetThemeAction('custom') as any);
          done();
        });
      });

      it('should return true', (done) => {
        themeService.updateThemeOnRouteChange$(url, {} as ActivatedRouteSnapshot).subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when no themes are present', () => {
      beforeEach(() => {
        setupServiceWithActions(
          hot('--a-', {
            a: {
              type: ROUTER_NAVIGATED,
              payload: { routerState: { url } },
            },
          }),
        );
        (themeService as any).themes = [];
      });

      it('should not dispatch any action', (done) => {
        themeService.updateThemeOnRouteChange$(url, {} as ActivatedRouteSnapshot).subscribe(() => {
          expect((themeService as any).store.dispatch).not.toHaveBeenCalled();
          done();
        });
      });

      it('should return false', (done) => {
        themeService.updateThemeOnRouteChange$(url, {} as ActivatedRouteSnapshot).subscribe((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe('when a dso is present in the snapshot\'s data', () => {
      let snapshot;

      beforeEach(() => {
        setupServiceWithActions(
          hot('--a-', {
            a: {
              type: ROUTER_NAVIGATED,
              payload: { routerState: { url } },
            },
          }),
        );
        spyOnPrivateMethods();
        snapshot = Object.assign({
          data: {
            dso: createSuccessfulRemoteDataObject(dso),
          },
        });
      });

      it('should match the theme to the dso', (done) => {
        themeService.updateThemeOnRouteChange$(url, snapshot).subscribe(() => {
          expect((themeService as any).matchThemeToDSOs).toHaveBeenCalled();
          done();
        });
      });

      it('should set the theme it receives from the data dso', (done) => {
        themeService.updateThemeOnRouteChange$(url, snapshot).subscribe(() => {
          expect((themeService as any).store.dispatch).toHaveBeenCalledWith(new SetThemeAction('custom') as any);
          done();
        });
      });

      it('should return true', (done) => {
        themeService.updateThemeOnRouteChange$(url, snapshot).subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('when a scope is present in the snapshot\'s parameters', () => {
      let snapshot;

      beforeEach(() => {
        setupServiceWithActions(
          hot('--a-', {
            a: {
              type: ROUTER_NAVIGATED,
              payload: { routerState: { url } },
            },
          }),
        );
        spyOnPrivateMethods();
        snapshot = Object.assign({
          queryParams: {
            scope: mockCommunity.uuid,
          },
        });
      });

      it('should match the theme to the dso found through the scope', (done) => {
        themeService.updateThemeOnRouteChange$(url, snapshot).subscribe(() => {
          expect((themeService as any).matchThemeToDSOs).toHaveBeenCalled();
          done();
        });
      });

      it('should set the theme it receives from the dso found through the scope', (done) => {
        themeService.updateThemeOnRouteChange$(url, snapshot).subscribe(() => {
          expect((themeService as any).store.dispatch).toHaveBeenCalledWith(new SetThemeAction('custom') as any);
          done();
        });
      });

      it('should return true', (done) => {
        themeService.updateThemeOnRouteChange$(url, snapshot).subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });
  });

  describe('private functions', () => {
    beforeEach(() => {
      setupServiceWithActions(hot('-', {}));
    });

    describe('getActionForMatch', () => {
      it('should return a SET action if the new theme differs from the current theme', () => {
        const theme = new Theme({ name: 'new-theme' });
        expect((themeService as any).getActionForMatch(theme, 'old-theme')).toEqual(new SetThemeAction('new-theme'));
      });

      it('should return an empty action if the new theme equals the current theme', () => {
        const theme = new Theme({ name: 'old-theme' });
        expect((themeService as any).getActionForMatch(theme, 'old-theme')).toEqual(new NoOpAction());
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
          matches: () => observableOf(false),
        });
        itemMatchingTheme = Object.assign(new Theme({ name: 'item-matching-theme' }), {
          matches: (url, dso) => observableOf((dso as any).type === ITEM.value),
        });
        communityMatchingTheme = Object.assign(new Theme({ name: 'community-matching-theme' }), {
          matches: (url, dso) => observableOf((dso as any).type === COMMUNITY.value),
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
          themeService.themes = themes;
        });

        it('should return undefined', (done: DoneFn) => {
          (themeService as any).matchThemeToDSOs(dsos, '').subscribe((theme: Theme) => {
            expect(theme).toBeUndefined();
            done();
          });
        });
      });

      describe('when one of the themes match a DSOs', () => {
        beforeEach(() => {
          themes = [ nonMatchingTheme, itemMatchingTheme ];
          themeService.themes = themes;
        });

        it('should return the matching theme', (done: DoneFn) => {
          (themeService as any).matchThemeToDSOs(dsos, '').subscribe((theme: Theme) => {
            expect(theme).toBe(itemMatchingTheme);
            done();
          });
        });
      });

      describe('when multiple themes match some of the DSOs', () => {
        it('should return the first matching theme (itemMatchingTheme)', (done: DoneFn) => {
          themes = [ nonMatchingTheme, itemMatchingTheme, communityMatchingTheme ];
          themeService.themes = themes;
          (themeService as any).matchThemeToDSOs(dsos, '').subscribe((theme: Theme) => {
            expect(theme).toBe(itemMatchingTheme);
            done();
          });
        });

        it('should return the first matching theme (communityMatchingTheme)', (done: DoneFn) => {
          themes = [ nonMatchingTheme, communityMatchingTheme, itemMatchingTheme ];
          themeService.themes = themes;
          (themeService as any).matchThemeToDSOs(dsos, '').subscribe((theme: Theme) => {
            expect(theme).toBe(communityMatchingTheme);
            done();
          });
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
          (themeService as any).getAncestorDSOs(),
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
          (themeService as any).getAncestorDSOs(),
        ).subscribe((result) => {
          expect(result).toEqual([dso]);
          done();
        });
      });
    });
  });

  describe('listenForThemeChanges', () => {
    let document;
    let headSpy;

    beforeEach(() => {
      const mockDsoService = {
        findById: () => createSuccessfulRemoteDataObject$(mockCommunity),
      };
      configurationService = new ConfigurationDataServiceStub();

      TestBed.configureTestingModule({
        imports: [
          CommonModule,
        ],
        providers: [
          ThemeService,
          { provide: LinkService, useValue: linkService },
          provideMockStore({ initialState }),
          { provide: DSpaceObjectDataService, useValue: mockDsoService },
          { provide: Router, useValue: new RouterMock() },
          { provide: ConfigurationDataService, useValue: configurationService },
        ],
      });

      document = TestBed.inject(DOCUMENT);
      headSpy = jasmine.createSpyObj('head', ['appendChild', 'getElementsByClassName']);
      headSpy.getElementsByClassName.and.returnValue([]);
      spyOn(document, 'getElementsByTagName').and.returnValue([headSpy]);

      themeService = TestBed.inject(ThemeService);
      spyOn(themeService, 'getThemeName').and.returnValue('custom');
      spyOn(themeService, 'getThemeName$').and.returnValue(observableOf('custom'));
    });

    it('should append a link element with the correct attributes to the head element', () => {
      themeService.listenForThemeChanges(true);

      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('class', 'theme-css');
      link.setAttribute('href', 'custom-theme.css');

      expect(headSpy.appendChild).toHaveBeenCalledWith(link);
    });
  });
});
