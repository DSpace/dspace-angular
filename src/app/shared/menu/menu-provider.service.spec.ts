import { waitForAsync } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  ResolveEnd,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { of } from 'rxjs';

import { COMMUNITY_MODULE_PATH } from '../../community-page/community-page-routing-paths';
import { MenuService } from './menu.service';
import { MenuID } from './menu-id.model';
import { MenuItemType } from './menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from './menu-provider.model';
import { MenuProviderService } from './menu-provider.service';
import { MenuRoute } from './menu-route.model';

describe('MenuProviderService', () => {

  class TestMenuProvider extends AbstractMenuProvider {

    constructor(
      public menuID: MenuID,
      public shouldPersistOnRouteChange: boolean,
      public menuProviderId: string,
      public index: number,
      public activePaths: MenuRoute[],
      public parentID: string,
      public alwaysRenderExpandable: boolean,
      public sections: PartialMenuSection[],
      public renderBrowserOnly: boolean = false,
    ) {
      super();
    }

    getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) {
      return of(this.sections);
    }
  }


  let menuProviderService: MenuProviderService;
  let menuService: MenuService;

  const router = {
    events: of(new ResolveEnd(1, 'test-url', 'test-url-after-redirect', {
      url: 'test-url',
      root: {
        url: [new UrlSegment('test-url', {})], data: {},
      },
      data: {},
    } as any)),
  };

  const section = {
    visible: true, model: {
      type: MenuItemType.TEXT,
      text: `test1`,
    },
  };

  const sectionToBeRemoved = {
    id: 'sectionToBeRemoved',
    visible: true, model: {
      type: MenuItemType.TEXT,
      text: `test1`,
    },
  };


  const persistentProvider1 = new TestMenuProvider(MenuID.PUBLIC, true, 'provider1', 0, undefined, undefined, false, [section]);
  const persistentProvider2 = new TestMenuProvider(MenuID.PUBLIC, true, 'provider2', 1, undefined, 'provider1', false, [section, section]);
  const nonPersistentProvider3 = new TestMenuProvider(MenuID.PUBLIC, false, 'provider3', 2, undefined, undefined, false, [section]);
  const nonPersistentProvider4 = new TestMenuProvider(MenuID.PUBLIC, false, 'provider4', 3, undefined, 'provider3', false, [section]);
  const nonPersistentProvider5WithRoutes = new TestMenuProvider(MenuID.PUBLIC, false, 'provider5', 4, [MenuRoute.COMMUNITY_PAGE, MenuRoute.COLLECTION_PAGE], undefined, false, [section]);
  const nonPersistentProvider6WithRoutesAndBrowserOnlyRendering = new TestMenuProvider(MenuID.PUBLIC, false, 'provider6', 5, [MenuRoute.COMMUNITY_PAGE, MenuRoute.COLLECTION_PAGE], undefined, false, [section], true);
  const persistentProvider7WithBrowserOnlyRendering = new TestMenuProvider(MenuID.PUBLIC, true, 'provider7', 6, undefined, undefined, false, [section], true);
  const nonPersistentProvider8WithBrowserOnlyRendering = new TestMenuProvider(MenuID.PUBLIC, false, 'provider8', 3, undefined, undefined, false, [section], true);




  const listOfProvider = [persistentProvider1, persistentProvider2, nonPersistentProvider3, nonPersistentProvider4, nonPersistentProvider5WithRoutes, nonPersistentProvider6WithRoutesAndBrowserOnlyRendering, persistentProvider7WithBrowserOnlyRendering, nonPersistentProvider8WithBrowserOnlyRendering];

  const expectedSection1 = generateAddedSection(persistentProvider1, section);
  const expectedSection21 = generateAddedSection(persistentProvider2, section);
  const expectedSection22 = generateAddedSection(persistentProvider2, section, 1);
  const expectedSection3 = generateAddedSection(nonPersistentProvider3, section);
  const expectedSection4 = generateAddedSection(nonPersistentProvider4, section);
  const expectedSection5 = generateAddedSection(nonPersistentProvider5WithRoutes, section);
  const expectedSection6 = generateAddedSection(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering, section);
  const expectedSection7 = generateAddedSection(persistentProvider7WithBrowserOnlyRendering, section);
  const expectedSection8 = generateAddedSection(nonPersistentProvider8WithBrowserOnlyRendering, section);

  function generateAddedSection(provider, sectionToAdd, index = 0) {
    return {
      ...sectionToAdd,
      id: sectionToAdd.id ?? `${provider.menuProviderId}_${index}`,
      parentID: sectionToAdd.parentID ?? provider.parentID,
      index: sectionToAdd.index ?? provider.index,
      active: false,
      shouldPersistOnRouteChange: sectionToAdd.shouldPersistOnRouteChange ?? provider.shouldPersistOnRouteChange,
      alwaysRenderExpandable: sectionToAdd.alwaysRenderExpandable ?? provider.alwaysRenderExpandable,
    };
  }


  beforeEach(waitForAsync(() => {

    menuService = jasmine.createSpyObj('MenuService',
      {
        addSection: {},
        removeSection: {},
        getMenu: of({ id: MenuID.PUBLIC }),
        getNonPersistentMenuSections: of([sectionToBeRemoved]),

      });

    menuProviderService = new MenuProviderService(listOfProvider, menuService, router as any);

  }));

  describe('initPersistentMenus', () => {
    describe('when server side rendering', () => {
      it('should initialise the menu sections from the persistent providers while skipping the ones that should not be rendered on SSR', () => {
        menuProviderService.initPersistentMenus(true);

        expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });

    });
    describe('when browser side rendering', () => {
      it('should initialise the menu sections from the persistent providers without skipping the ones that should not be rendered on SSR', () => {
        menuProviderService.initPersistentMenus(false);

        expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });

    });
  });

  describe('resolveRouteMenus with no matching path specific providers', () => {
    describe('when browser side rendering', () => {
      it('should remove the current non persistent menus and add the general non persistent menus', () => {
        const route = { data: {} };
        const state = { url: 'test-url' };
        menuProviderService.resolveRouteMenus(route as any, state as any, false).subscribe();

        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });
    });
    describe('when server side rendering', () => {
      it('should remove the current non persistent menus and add the general non persistent menus', () => {
        const route = { data: {} };
        const state = { url: 'test-url' };
        menuProviderService.resolveRouteMenus(route as any, state as any, true).subscribe();

        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });
    });
  });

  describe('resolveRouteMenus with a matching path specific provider', () => {
    describe('when browser side rendering', () => {
      it('should remove the current non persistent menus and add the general non persistent menus', () => {
        const route = { data: { menuRoute: MenuRoute.COMMUNITY_PAGE } };
        const state = { url: `xxxx/${COMMUNITY_MODULE_PATH}/xxxxxx` };
        menuProviderService.resolveRouteMenus(route as any, state as any, false).subscribe();

        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });
    });
    describe('when server side rendering', () => {
      it('should remove the current non persistent menus and add the general non persistent menus', () => {
        const route = { data: { menuRoute: MenuRoute.COMMUNITY_PAGE } };
        const state = { url: `xxxx/${COMMUNITY_MODULE_PATH}/xxxxxx` };
        menuProviderService.resolveRouteMenus(route as any, state as any, true).subscribe();

        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });
    });
  });

  describe('listenForRouteChanges ', () => {
    describe('when browser side rendering', () => {
      it('should listen to the route changes and update the menu sections based on the retrieved state and route', () => {
        menuProviderService.listenForRouteChanges(false);

        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });
    });
    describe('when server side rendering', () => {
      it('should listen to the route changes and update the menu sections based on the retrieved state and route', () => {
        menuProviderService.listenForRouteChanges(true);

        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
        expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection21);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection22);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
        expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider6WithRoutesAndBrowserOnlyRendering.menuID, expectedSection6);
        expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider7WithBrowserOnlyRendering.menuID, expectedSection7);
        expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider8WithBrowserOnlyRendering.menuID, expectedSection8);
      });
    });
  });
});

