import { Component, Injector } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, MenuItemType } from '../shared/menu/initial-menus-state';
import { TextMenuItemModel } from '../shared/menu/menu-item/models/text.model';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';
import { BrowseService } from '../core/browse/browse.service';
import { getFirstSucceededRemoteListPayload } from '../core/shared/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { environment } from '../../environments/environment';
import { map, switchMap, take } from 'rxjs/operators';
import { SectionDataService } from '../core/layout/section-data.service';
import { combineLatest } from 'rxjs';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { Section } from '../core/layout/models/section.model';


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

  private activatedRoutesLastChild: ActivatedRoute;

  /**
   * The boolean to check if user can view Usage
   */
  private _canViewUsage: boolean;

  /**
   * The boolean to check if user can view Login
   */
  private _canViewLogin: boolean;

  /**
   * The boolean to check if user can view Workflow
   */
  private _canViewWorkflow: boolean;

  constructor(protected menuService: MenuService,
              protected injector: Injector,
              public windowService: HostWindowService,
              public browseService: BrowseService,
              public authorizationService: AuthorizationDataService,
              protected sectionDataService: SectionDataService,
              public route: ActivatedRoute
  ) {
    super(menuService, injector, authorizationService, route);
  }

  ngOnInit(): void {
    this.activatedRoutesLastChild = this.getActivatedRoute(this.route);
    combineLatest([
      this.getAuthorizedUsageStatistics(),
      this.getAuthorizedLoginStatistics(),
      this.getAuthorizedWorkflowStatistics()
    ]).pipe(take(1)).subscribe(([canViewUsage, canViewLogin, canViewWorkflow]) => {
      this._canViewUsage = canViewUsage;
      this._canViewLogin = canViewLogin;
      this._canViewWorkflow = canViewWorkflow;
      this.createMenu();
      super.ngOnInit();
    });
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

    if (this._canViewUsage || this._canViewLogin || this._canViewWorkflow) {
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

      if (this._canViewUsage) {
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

      if (this._canViewLogin) {
        menuList.push({
          id: 'statistics_login',
          parentID: 'statistics',
          active: false,
          visible: true,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.statistics.login',
            link: '/statistics/login'
          } as LinkMenuItemModel
        });
      }

      if (this._canViewWorkflow) {
        menuList.push({
          id: 'statistics_workflow',
          parentID: 'statistics',
          active: false,
          visible: true,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.statistics.workflow',
            link: '/statistics/workflow'
          } as LinkMenuItemModel
        });
      }
    }

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

  /**
   *  Checking authorization for Usage
   */
  getAuthorizedUsageStatistics() {
    return this.activatedRoutesLastChild.data.pipe(
      switchMap((data) => {
        return this.authorizationService.isAuthorized(FeatureID.CanViewUsageStatistics, this.getObjectUrl(data)).pipe(
          map((canViewUsageStatistics: boolean) => {
            return canViewUsageStatistics;
          }));
      })
    );
  }

  /**
   *  Checking authorization for Login
   */
  getAuthorizedLoginStatistics() {
    return this.activatedRoutesLastChild.data.pipe(
      switchMap((data) => {
        return this.authorizationService.isAuthorized(FeatureID.CanViewLoginStatistics, this.getObjectUrl(data)).pipe(
          map((canViewLoginStatistics: boolean) => {
            return canViewLoginStatistics;
          }));
      })
    );
  }

  /**
   *  Checking authorization for Workflow
   */
  getAuthorizedWorkflowStatistics() {
    return this.activatedRoutesLastChild.data.pipe(
      switchMap((data) => {
        return this.authorizationService.isAuthorized(FeatureID.CanViewWorkflowStatistics, this.getObjectUrl(data)).pipe(
          map((canViewWorkflowStatistics: boolean) => {
            return canViewWorkflowStatistics;
          }));
      })
    );
  }
}
