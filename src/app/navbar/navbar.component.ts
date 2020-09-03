import { Component, Inject, Injector, OnInit } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../shared/menu/initial-menus-state';
import { TextMenuItemModel } from '../shared/menu/menu-item/models/text.model';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';
import { environment } from '../../environments/environment';
import { SectionDataService } from '../core/layout/section-data.service';
import { getFirstSucceededRemoteListPayload, getPaginatedListPayload } from '../core/shared/operators';

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
              public windowService: HostWindowService,
              protected sectionDataService: SectionDataService
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
      /* Communities & Collections tree */
      {
        id: `communities_and_collections`,
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: `menu.section.communities_and_collections`,
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

    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
      shouldPersistOnRouteChange: true
    })));

    this.sectionDataService.findAll()
      .pipe( getFirstSucceededRemoteListPayload())
      .subscribe( (sections) => {
        sections.forEach( (section) => {
          const menuSection = {
            id: `explore_${section.id}`,
            active: false,
            visible: true,
            model: {
              type: MenuItemType.LINK,
              text: `menu.section.explore_${section.id}`,
              link: `/explore/${section.id}`
            } as LinkMenuItemModel
          };
          this.menuService.addSection(this.menuID, Object.assign(menuSection, {
            shouldPersistOnRouteChange: true
          }));
        });
      });

  }

}
