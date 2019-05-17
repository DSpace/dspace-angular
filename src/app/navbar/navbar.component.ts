import { Component, Injector, OnInit } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../shared/menu/initial-menus-state';
import { TextMenuItemModel } from '../shared/menu/menu-item/models/text.model';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['navbar.component.scss'],
  // templateUrl: './navbar.component.html',
  templateUrl: './themes/navbar.component.mantis.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends MenuComponent implements OnInit {
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
    const menuList = [
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
      // {
      //   id: 'browse_global_communities_and_collections',
      //   parentID: 'browse_global',
      //   active: false,
      //   visible: true,
      //   model: {
      //     type: MenuItemType.LINK,
      //     text: 'menu.section.browse_global_communities_and_collections',
      //     link: '#'
      //   } as LinkMenuItemModel,
      // },
      {
        id: 'browse_global_global_by_title',
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.browse_global_by_title',
          link: '/browse/title'
        } as LinkMenuItemModel,
      },
      {
        id: 'browse_global_global_by_issue_date',
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.browse_global_by_issue_date',
          link: '/browse/dateissued'
        } as LinkMenuItemModel,
      },
      {
        id: 'browse_global_by_author',
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.browse_global_by_author',
          link: '/browse/author'
        } as LinkMenuItemModel,
      },
      {
        id: 'browse_global_by_subject',
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.browse_global_by_subject',
          link: '/browse/subject'
        } as LinkMenuItemModel,
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
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, menuSection));

  }

}
