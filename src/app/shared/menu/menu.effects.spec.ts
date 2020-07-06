import { MenuID, MenuItemType } from './initial-menus-state';
import { MenuSection } from './menu.reducer';
import { LinkMenuItemModel } from './menu-item/models/link.model';
import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { provideMockActions } from '@ngrx/effects/testing';
import { of as observableOf } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MenuEffects } from './menu.effects';

describe('MenuEffects', () => {
  let menuEffects: MenuEffects;
  let routeDataMenuSection: MenuSection;
  let routeDataMenuChildSection: MenuSection;
  let toBeRemovedMenuSection: MenuSection;
  let alreadyPresentMenuSection: MenuSection;
  let route;
  let menuService;
  let actions: Observable<any>;

  function init() {
    routeDataMenuSection = {
      id: 'mockSection',
      active: false,
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.mockSection',
        link: ''
      } as LinkMenuItemModel
    };
    routeDataMenuChildSection = {
      id: 'mockChildSection',
      parentID: 'mockSection',
      active: false,
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.mockChildSection',
        link: ''
      } as LinkMenuItemModel
    };
    toBeRemovedMenuSection = {
      id: 'toBeRemovedSection',
      active: false,
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.toBeRemovedSection',
        link: ''
      } as LinkMenuItemModel
    };
    alreadyPresentMenuSection = {
      id: 'alreadyPresentSection',
      active: false,
      visible: true,
      model: {
        type: MenuItemType.LINK,
        text: 'menu.section.alreadyPresentSection',
        link: ''
      } as LinkMenuItemModel
    };
    route = {
      root: {
        snapshot: {
          data: {
            menu: {
              [MenuID.PUBLIC]: [routeDataMenuSection, alreadyPresentMenuSection]
            }
          }
        },
        firstChild: {
          snapshot: {
            data: {
              menu: {
                [MenuID.PUBLIC]: routeDataMenuChildSection
              }
            }
          }
        }
      }
    };

    menuService = jasmine.createSpyObj('menuService', {
      getNonPersistentMenuSections: observableOf([toBeRemovedMenuSection, alreadyPresentMenuSection]),
      addSection: {},
      removeSection: {}
    });
  }

  beforeEach(() => {
    init();
    TestBed.configureTestingModule({
      providers: [
        MenuEffects,
        { provide: MenuService, useValue: menuService },
        { provide: ActivatedRoute, useValue: route },
        provideMockActions(() => actions)
      ]
    });

    menuEffects = TestBed.get(MenuEffects);
  });

  describe('buildRouteMenuSections$', () => {
    it('should add and remove menu sections depending on the current route', () => {
      actions = hot('--a-', {
        a: {
          type: ROUTER_NAVIGATED
        }
      });

      const expected = cold('--b-', {
        b: {
          type: ROUTER_NAVIGATED
        }
      });

      expect(menuEffects.buildRouteMenuSections$).toBeObservable(expected);
      expect(menuService.addSection).toHaveBeenCalledWith(MenuID.PUBLIC, routeDataMenuSection);
      expect(menuService.addSection).toHaveBeenCalledWith(MenuID.PUBLIC, routeDataMenuChildSection);
      expect(menuService.addSection).not.toHaveBeenCalledWith(MenuID.PUBLIC, alreadyPresentMenuSection);
      expect(menuService.removeSection).toHaveBeenCalledWith(MenuID.PUBLIC, toBeRemovedMenuSection.id);
    });
  });
});
