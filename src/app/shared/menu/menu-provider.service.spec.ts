import { AbstractMenuProvider, PartialMenuSection } from './menu-provider.model';
import { MenuID } from './menu-id.model';
import { ActivatedRouteSnapshot, ResolveEnd, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { MenuItemType } from './menu-item-type.model';
import { waitForAsync } from '@angular/core/testing';
import { MenuProviderService } from './menu-provider.service';
import { MenuService } from './menu.service';
import { COMMUNITY_MODULE_PATH } from '../../community-page/community-page-routing-paths';
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
      public sections: PartialMenuSection[]
    ) {
      super();
    }

    getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) {
      return observableOf(this.sections);
    }
  }


  let menuProviderService: MenuProviderService;
  let menuService: MenuService;

  const router = {
    events: observableOf(new ResolveEnd(1, 'test-url', 'test-url-after-redirect', {
      url: 'test-url',
      root: {url: [new UrlSegment('test-url', {})],       data: {}
      },
      data: {}
    } as any))
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
  const persistentProvider2 = new TestMenuProvider(MenuID.PUBLIC, true, 'provider2', 1, undefined, 'provider1', false, [section]);
  const nonPersistentProvider3 = new TestMenuProvider(MenuID.PUBLIC, false, 'provider3', 2, undefined, undefined, false, [section]);
  const nonPersistentProvider4 = new TestMenuProvider(MenuID.PUBLIC, false, 'provider4', 3, undefined, 'provider3', false, [section]);
  const nonPersistentProvider5WithRoutes = new TestMenuProvider(MenuID.PUBLIC, false, 'provider4', 3, [MenuRoute.SIMPLE_COMMUNITY_PAGE, MenuRoute.SIMPLE_COLLECTION_PAGE,], undefined, false, [section]);

  const listOfProvider = [persistentProvider1, persistentProvider2, nonPersistentProvider3, nonPersistentProvider4, nonPersistentProvider5WithRoutes];

  const expectedSection1 = generateAddedSection(persistentProvider1, section);
  const expectedSection2 = generateAddedSection(persistentProvider2, section);
  const expectedSection3 = generateAddedSection(nonPersistentProvider3, section);
  const expectedSection4 = generateAddedSection(nonPersistentProvider4, section);
  const expectedSection5 = generateAddedSection(nonPersistentProvider5WithRoutes, section);

  function generateAddedSection(provider, sectionToAdd) {
    return {
      ...sectionToAdd,
      id: sectionToAdd.id ?? `${provider.menuProviderId}`,
      parentID: sectionToAdd.parentID ?? provider.parentID,
      index: sectionToAdd.index ?? provider.index,
      shouldPersistOnRouteChange: sectionToAdd.shouldPersistOnRouteChange ?? provider.shouldPersistOnRouteChange,
      alwaysRenderExpandable: sectionToAdd.alwaysRenderExpandable ?? provider.alwaysRenderExpandable,
    };
  }


  beforeEach(waitForAsync(() => {

    menuService = jasmine.createSpyObj('MenuService',
      {
        addSection: {},
        removeSection: {},
        getMenu: observableOf({id: MenuID.PUBLIC}),
        getNonPersistentMenuSections: observableOf([sectionToBeRemoved])

      });

    menuProviderService = new MenuProviderService(listOfProvider, menuService, router as any);

  }));

  describe('initPersistentMenus', () => {
    it('should initialise the menu sections from the persistent providers', () => {
      menuProviderService.initPersistentMenus();

      expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
      expect(menuService.addSection).toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection2);
      expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
      expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
      expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
    });
  });

  describe('resolveRouteMenus with no matching path specific providers', () => {
    it('should remove the current non persistent menus and add the general non persistent menus', () => {
      const route = {data:{}};
      const state = {url: 'test-url'};
      menuProviderService.resolveRouteMenus(route as any, state as any).subscribe();

      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

      expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
      expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection2);
      expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
      expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
      expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
    });
  });

  describe('resolveRouteMenus with a matching path specific provider', () => {
    it('should remove the current non persistent menus and add the general non persistent menus', () => {
      const route = {data:{ menuRoute: MenuRoute.SIMPLE_COMMUNITY_PAGE}};
      const state = {url: `xxxx/${COMMUNITY_MODULE_PATH}/xxxxxx`};
      menuProviderService.resolveRouteMenus(route as any, state as any).subscribe();

      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

      expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
      expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection2);
      expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
      expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
      expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
    });
  });

  describe('listenForRouteChanges ', () => {
    it('should listen to the route changes and update the menu sections based on the retrieved state and route', () => {
      menuProviderService.listenForRouteChanges();

      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, sectionToBeRemoved.id);
      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.ADMIN, sectionToBeRemoved.id);
      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.DSO_EDIT, sectionToBeRemoved.id);

      expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider1.menuID, expectedSection1);
      expect(menuService.addSection).not.toHaveBeenCalledWith(persistentProvider2.menuID, expectedSection2);
      expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider3.menuID, expectedSection3);
      expect(menuService.addSection).toHaveBeenCalledWith(nonPersistentProvider4.menuID, expectedSection4);
      expect(menuService.addSection).not.toHaveBeenCalledWith(nonPersistentProvider5WithRoutes.menuID, expectedSection5);
    });
  });


});

