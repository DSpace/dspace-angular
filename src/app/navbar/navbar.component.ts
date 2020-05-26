import { Component, Inject, Injector, OnInit } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../shared/menu/initial-menus-state';
import { TextMenuItemModel } from '../shared/menu/menu-item/models/text.model';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';
import { environment } from '../../environments/environment';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends MenuComponent {
  /**
   * The menu ID of the Navbar is PUBLIC
   * @type {MenuID.PUBLIC}
   */
  menuID = MenuID.PUBLIC;

  constructor(protected menuService: MenuService,
              protected injector: Injector,
              public windowService: HostWindowService
  ) {
    super(menuService, injector);
  }

  ngOnInit(): void {
    this.createMenu();
    super.ngOnInit();
  }

  /**
   * Initialize all menu sections and items for this menu
   */
  createMenu() {
    const menuList: any[] = [
      /* News */
      {
        id: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.browse_global'
        } as TextMenuItemModel,
        index: 0
      },
      /* Communities & Collections tree */
      {
        id: `browse_global_communities_and_collections`,
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: `menu.section.browse_global_communities_and_collections`,
          link: `/community-list`
        } as LinkMenuItemModel
      },

      /* Statistics */
      {
        id: 'statistics',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.statistics',
          link: ''
        } as LinkMenuItemModel,
        index: 2
      },
    ];
    // Read the different Browse-By types from config and add them to the browse menu
    const types = environment.browseBy.types;
    types.forEach((typeConfig) => {
      menuList.push({
        id: `browse_global_by_${typeConfig.id}`,
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: `menu.section.browse_global_by_${typeConfig.id}`,
          link: `/browse/${typeConfig.id}`
        } as LinkMenuItemModel
      });
    });
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
      shouldPersistOnRouteChange: true
    })));

  }

}
