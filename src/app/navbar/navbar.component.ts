import { Component, Injector } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';
import { SectionDataService } from '../core/layout/section-data.service';
import { getFirstSucceededRemoteListPayload } from '../core/shared/operators';
import { Section } from '../core/layout/models/section.model';
import { environment } from '../../environments/environment';
import { TextMenuItemModel } from '../shared/menu/menu-item/models/text.model';
import { Observable } from 'rxjs';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { take } from 'rxjs/operators';

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
              protected sectionDataService: SectionDataService,
              protected authorizationService: AuthorizationDataService
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
    const menuList: any[] = [];

    /* Communities & Collections tree */
    const CommunityCollectionMenuItem = {
      id: `browse_global_communities_and_collections`,
      active: false,
      visible: environment.layout.navbar.showCommunityCollection,
      index: 0,
      model: {
        type: MenuItemType.LINK,
        text: `menu.section.communities_and_collections`,
        link: `/community-list`
      } as LinkMenuItemModel
    };

    if (environment.layout.navbar.showCommunityCollection) {
      menuList.push(CommunityCollectionMenuItem);
    }


    this.isCurrentUserAdmin().subscribe(((isAdmin) => {

        if (isAdmin) {

          menuList.push(
            {
              id: 'statistics',
              active: false,
              visible: true,
              index: 1,
              model: {
                type: MenuItemType.TEXT,
                text: 'menu.section.statistics'
              } as TextMenuItemModel,
            }
          );

          menuList.push({
            id: 'statistics_site',
            parentID: 'statistics',
            active: false,
            visible: true,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.statistics.site',
              link: '/statistics'
            } as LinkMenuItemModel
          });
        }
      }

    ));

    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
      shouldPersistOnRouteChange: true
    })));

    this.sectionDataService.findVisibleSections()
      .pipe( getFirstSucceededRemoteListPayload())
      .subscribe( (sections: Section[]) => {
        sections
          .forEach( (section) => {
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

  isCurrentUserAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, undefined, undefined)
      .pipe(
        take(1)
      );
  }
}
