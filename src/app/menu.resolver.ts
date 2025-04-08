import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { combineLatest as observableCombineLatest, Observable, of } from 'rxjs';
import { MenuID } from './shared/menu/menu-id.model';
import { MenuState } from './shared/menu/menu-state.model';
import { MenuItemType } from './shared/menu/menu-item-type.model';
import { LinkMenuItemModel } from './shared/menu/menu-item/models/link.model';
import { getFirstCompletedRemoteData } from './core/shared/operators';
import { PaginatedList } from './core/data/paginated-list.model';
import { RemoteData } from './core/data/remote-data';
import { TextMenuItemModel } from './shared/menu/menu-item/models/text.model';
import { MenuService } from './shared/menu/menu.service';
import { filter, find, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { hasValue, isNotEmpty } from './shared/empty.util';
import { FeatureID } from './core/data/feature-authorization/feature-id';
import {
  ThemedCreateCommunityParentSelectorComponent
} from './shared/dso-selector/modal-wrappers/create-community-parent-selector/themed-create-community-parent-selector.component';
import { OnClickMenuItemModel } from './shared/menu/menu-item/models/onclick.model';
import {
  ThemedCreateCollectionParentSelectorComponent
} from './shared/dso-selector/modal-wrappers/create-collection-parent-selector/themed-create-collection-parent-selector.component';
import {
  ThemedCreateItemParentSelectorComponent
} from './shared/dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
import {
  ThemedEditCommunitySelectorComponent
} from './shared/dso-selector/modal-wrappers/edit-community-selector/themed-edit-community-selector.component';
import {
  ThemedEditCollectionSelectorComponent
} from './shared/dso-selector/modal-wrappers/edit-collection-selector/themed-edit-collection-selector.component';
import {
  ThemedEditItemSelectorComponent
} from './shared/dso-selector/modal-wrappers/edit-item-selector/themed-edit-item-selector.component';
import {
  ExportMetadataCsvSelectorComponent
} from './shared/dso-selector/modal-wrappers/export-metadata-csv-selector/export-metadata-csv-selector.component';
import {
  ExportMetadataXlsSelectorComponent
} from './shared/dso-selector/modal-wrappers/export-metadata-xls-selector/export-metadata-xls-selector.component';
import { AuthorizationDataService } from './core/data/feature-authorization/authorization-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  METADATA_EXPORT_SCRIPT_NAME,
  METADATA_IMPORT_SCRIPT_NAME,
  ScriptDataService
} from './core/data/processes/script-data.service';
import {
  ExportBatchSelectorComponent
} from './shared/dso-selector/modal-wrappers/export-batch-selector/export-batch-selector.component';
import { AuthService } from './core/auth/auth.service';
import { environment } from '../environments/environment';
import { SectionDataService } from './core/layout/section-data.service';
import { Section } from './core/layout/models/section.model';
import { NOTIFICATIONS_RECITER_SUGGESTION_PATH } from './admin/admin-notifications/admin-notifications-routing-paths';
import { isPlatformBrowser } from '@angular/common';
import { ConfigurationDataService } from './core/data/configuration-data.service';
import { ConfigurationProperty } from './core/shared/configuration-property.model';

/**
 * Creates all the app's menus
 */
@Injectable({
  providedIn: 'root'
})
export class MenuResolver implements Resolve<boolean> {

  private activatedRouteLastChild: ActivatedRoute;

  constructor(
    @Inject(PLATFORM_ID) public platformId: any,
    protected route: ActivatedRoute,
    protected menuService: MenuService,
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected scriptDataService: ScriptDataService,
    protected authService: AuthService,
    protected sectionDataService: SectionDataService,
    protected configService: ConfigurationDataService,
  ) {
  }

  /**
   * Initialize all menus
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(true);
    }
    return observableCombineLatest([
      this.createPublicMenu$(),
      this.createAdminMenuIfLoggedIn$(),
    ]).pipe(
      map((menusDone: boolean[]) => menusDone.every(Boolean)),
    );
  }

  /**
   * Wait for a specific menu to appear
   * @param id  the ID of the menu to wait for
   * @return    an Observable that emits true as soon as the menu is created
   */
  protected waitForMenu$(id: MenuID): Observable<boolean> {
    return this.menuService.getMenu(id).pipe(
      find((menu: MenuState) => hasValue(menu)),
      map(() => true),
    );
  }

  /**
   * Initialize all menu sections and items for {@link MenuID.PUBLIC}
   */
  createPublicMenu$(): Observable<boolean> {
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

    // Read the different Browse-By types from config and add them to the browse menu
    this.sectionDataService.findVisibleSections().pipe(
      getFirstCompletedRemoteData()
    ).subscribe( (sectionDefListRD: RemoteData<PaginatedList<Section>>) => {
      if (sectionDefListRD.hasSucceeded) {
        sectionDefListRD.payload.page.forEach((section) => {
          let parentMenu: any = {
            id: `explore_${section.id}`,
            active: false,
            visible: true,
          };
          if (section.nestedSections && section.nestedSections.length) {
            section.nestedSections.forEach((nested) => {
              menuList.push({
                id: `explore_nested_${nested.id}`,
                parentID: `explore_${section.id}`,
                active: false,
                visible: true,
                model: {
                  type: MenuItemType.LINK,
                  text: `menu.section.explore_${nested.id}`,
                  link: `/explore/${nested.id}`
                } as LinkMenuItemModel
              });
            });
            parentMenu = {
              ...parentMenu,
              index: 1,
              model: {
                type: MenuItemType.TEXT,
                text: `menu.section.explore_${section.id}`
              } as TextMenuItemModel,
            };
          } else {
            parentMenu = {
              ...parentMenu,
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.explore_${section.id}`,
                link: `/explore/${section.id}`
              } as LinkMenuItemModel
            };
          }
          menuList.push(parentMenu);
        });
      }
      menuList.forEach((menuSection) => this.menuService.addSection(MenuID.PUBLIC, Object.assign(menuSection, {
        shouldPersistOnRouteChange: true
      })));
    });

    this.createStatisticsMenu();
    return this.waitForMenu$(MenuID.PUBLIC);
  }

  createStatisticsMenu() {
    this.activatedRouteLastChild = this.getActivatedRoute(this.route);
    observableCombineLatest([
      this.getAuthorizedUsageStatistics(),
      this.getAuthorizedLoginStatistics(),
      this.getAuthorizedWorkflowStatistics()
    ]).pipe(take(1)).subscribe(([canViewUsage, canViewLogin, canViewWorkflow]) => {
      const menuList = [];
      if (canViewUsage || canViewLogin || canViewWorkflow) {
        if (canViewUsage) {
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

        if (canViewLogin) {
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

        if (canViewWorkflow) {
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

        // the parent menu should be added after the children
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
      }
      menuList.forEach((menuSection) => this.menuService.addSection(MenuID.PUBLIC, Object.assign(menuSection, {
        shouldPersistOnRouteChange: true
      })));
    });
  }

  /**
   * Initialize all menu sections and items for {@link MenuID.ADMIN}, only if the user is logged in.
   */
  createAdminMenuIfLoggedIn$() {
    return this.authService.isAuthenticated().pipe(
      mergeMap((isAuthenticated) => isAuthenticated ? this.createAdminMenu$() : of(true)),
    );
  }

  /**
   * Initialize all menu sections and items for {@link MenuID.ADMIN}
   */
  createAdminMenu$() {
    this.createMainMenuSections();
    this.createSiteAdministratorMenuSections();
    this.createExportMenuSections();
    this.createImportMenuSections();
    this.createAccessControlMenuSections();
    this.createDLExporterMenuItem();

    return this.waitForMenu$(MenuID.ADMIN);
  }

  /**
   * Initialize the main menu sections.
   * edit_community / edit_collection is only included if the current user is a Community or Collection admin
   */
  createMainMenuSections() {
    observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.authorizationService.isAuthorized(FeatureID.CanSubmit),
      this.authorizationService.isAuthorized(FeatureID.CanEditItem),
    ]).subscribe(([isCollectionAdmin, isCommunityAdmin, isSiteAdmin, canSubmit, canEditItem]) => {
      const newSubMenuList = [
        /* Communities and Collections */
        {
          id: `browse_global_communities_and_collections`,
          active: false,
          visible: !environment.layout.navbar.showCommunityCollection && isCollectionAdmin,
          model: {
            type: MenuItemType.LINK,
            text: `menu.section.communities_and_collections`,
            link: `/community-list`
          } as LinkMenuItemModel,
          icon: 'users',
          index: 0
        },
        {
          id: 'new_community',
          parentID: 'new',
          active: false,
          visible: isCommunityAdmin,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.new_community',
            function: () => {
              this.modalService.open(ThemedCreateCommunityParentSelectorComponent);
            }
          } as OnClickMenuItemModel,
        },
        {
          id: 'new_collection',
          parentID: 'new',
          active: false,
          visible: isCommunityAdmin,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.new_collection',
            function: () => {
              this.modalService.open(ThemedCreateCollectionParentSelectorComponent);
            }
          } as OnClickMenuItemModel,
        },
        {
          id: 'new_item',
          parentID: 'new',
          active: false,
          visible: isSiteAdmin || isCommunityAdmin || isCollectionAdmin,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.new_item',
            function: () => {
              this.modalService.open(ThemedCreateItemParentSelectorComponent);
            }
          } as OnClickMenuItemModel,
        },
        {
          id: 'new_process',
          parentID: 'new',
          active: false,
          visible: isSiteAdmin,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.new_process',
            link: '/processes/new'
          } as LinkMenuItemModel,
        },
      ];
      const editSubMenuList = [
        /* Edit */
        {
          id: 'edit_community',
          parentID: 'edit',
          active: false,
          visible: isCommunityAdmin,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.edit_community',
            function: () => {
              this.modalService.open(ThemedEditCommunitySelectorComponent);
            }
          } as OnClickMenuItemModel,
        },
        {
          id: 'edit_collection',
          parentID: 'edit',
          active: false,
          visible: isCollectionAdmin,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.edit_collection',
            function: () => {
              this.modalService.open(ThemedEditCollectionSelectorComponent);
            }
          } as OnClickMenuItemModel,
        },
        {
          id: 'edit_item',
          parentID: 'edit',
          active: false,
          visible: canEditItem,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.edit_item',
            function: () => {
              this.modalService.open(ThemedEditItemSelectorComponent);
            }
          } as OnClickMenuItemModel,
        },
      ];
      const newSubMenu = {
        id: 'new',
        active: false,
        visible: newSubMenuList.some(subMenu => subMenu.visible),
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.new'
        } as TextMenuItemModel,
        icon: 'plus',
        index: 0
      };
      const editSubMenu = {
        id: 'edit',
        active: false,
        visible: editSubMenuList.some(subMenu => subMenu.visible),
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.edit'
        } as TextMenuItemModel,
        icon: 'pencil-alt',
        index: 1
      };

      const menuList = [
        ...newSubMenuList,
        newSubMenu,
        ...editSubMenuList,
        editSubMenu,
        // TODO: enable this menu item once the feature has been implemented
        // {
        //   id: 'new_item_version',
        //   parentID: 'new',
        //   active: false,
        //   visible: true,
        //   model: {
        //     type: MenuItemType.LINK,
        //     text: 'menu.section.new_item_version',
        //     link: ''
        //   } as LinkMenuItemModel,
        // },

        /* Statistics */
        // TODO: enable this menu item once the feature has been implemented
        // {
        //   id: 'statistics_task',
        //   active: false,
        //   visible: true,
        //   model: {
        //     type: MenuItemType.LINK,
        //     text: 'menu.section.statistics_task',
        //     link: ''
        //   } as LinkMenuItemModel,
        //   icon: 'chart-bar',
        //   index: 8
        // },

        /* Control Panel */
        // TODO: enable this menu item once the feature has been implemented
        // {
        //   id: 'control_panel',
        //   active: false,
        //   visible: isSiteAdmin,
        //   model: {
        //     type: MenuItemType.LINK,
        //     text: 'menu.section.control_panel',
        //     link: ''
        //   } as LinkMenuItemModel,
        //   icon: 'cogs',
        //   index: 9
        // },
        /*  Admin Search */
        {
          id: 'admin_search',
          active: false,
          visible: isSiteAdmin || isCollectionAdmin || isCommunityAdmin,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.admin_search',
            link: '/admin/search'
          } as LinkMenuItemModel,
          index: 5,
          icon: 'search',
        },
        /* Processes */
        {
          id: 'processes',
          active: false,
          visible: isSiteAdmin || isCommunityAdmin || isCollectionAdmin,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.processes',
            link: '/processes'
          } as LinkMenuItemModel,
          icon: 'terminal',
          index: 10
        },
        {
          id: 'health',
          active: false,
          visible: isSiteAdmin,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.health',
            link: '/health'
          } as LinkMenuItemModel,
          icon: 'heartbeat',
          index: 11
        },
      ];
      menuList.forEach((menuSection) => this.menuService.addSection(MenuID.ADMIN, Object.assign(menuSection, {
        shouldPersistOnRouteChange: true
      })));
    });
  }

  /**
   * Create menu sections dependent on whether or not the current user is a site administrator and on whether or not
   * the export scripts exist and the current user is allowed to execute them
   */
  createExportMenuSections() {
    const menuList = [
      // TODO: enable this menu item once the feature has been implemented
      // {
      //   id: 'export_community',
      //   parentID: 'export',
      //   active: false,
      //   visible: true,
      //   model: {
      //     type: MenuItemType.LINK,
      //     text: 'menu.section.export_community',
      //     link: ''
      //   } as LinkMenuItemModel,
      //   shouldPersistOnRouteChange: true
      // },
      // TODO: enable this menu item once the feature has been implemented
      // {
      //   id: 'export_collection',
      //   parentID: 'export',
      //   active: false,
      //   visible: true,
      //   model: {
      //     type: MenuItemType.LINK,
      //     text: 'menu.section.export_collection',
      //     link: ''
      //   } as LinkMenuItemModel,
      //   shouldPersistOnRouteChange: true
      // },
      // TODO: enable this menu item once the feature has been implemented
      // {
      //   id: 'export_item',
      //   parentID: 'export',
      //   active: false,
      //   visible: true,
      //   model: {
      //     type: MenuItemType.LINK,
      //     text: 'menu.section.export_item',
      //     link: ''
      //   } as LinkMenuItemModel,
      //   shouldPersistOnRouteChange: true
      // },
    ];
    menuList.forEach((menuSection) => this.menuService.addSection(MenuID.ADMIN, menuSection));

    observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
    ]).pipe(
      filter(([isAdmin, isCommunityAdmin, isCollectionAdmin]) =>
        isAdmin || isCollectionAdmin || isCommunityAdmin
      ),
      take(1),
      switchMap(() => this.scriptDataService.scriptWithNameExistsAndCanExecute(METADATA_EXPORT_SCRIPT_NAME)),
      filter((metadataExportScriptExists: boolean) => metadataExportScriptExists),
      take(1)
    ).subscribe(() => {
      // Hides the export menu for unauthorised people
      // If in the future more sub-menus are added,
      // it should be reviewed if they need to be in this subscribe
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'export',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.export'
        } as TextMenuItemModel,
        icon: 'file-export',
        index: 3,
        shouldPersistOnRouteChange: true
      });
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'export_metadata_csv',
        parentID: 'export',
        active: true,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.export_metadata_csv',
          function: () => {
            this.modalService.open(ExportMetadataCsvSelectorComponent);
          }
        } as OnClickMenuItemModel,
        shouldPersistOnRouteChange: true
      });
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'export_metadata_xls',
        parentID: 'export',
        active: true,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.export_metadata_xls',
          function: () => {
            this.modalService.open(ExportMetadataXlsSelectorComponent);
          }
        } as OnClickMenuItemModel,
        shouldPersistOnRouteChange: true
      });
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'export_batch',
        parentID: 'export',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.export_batch',
          function: () => {
            this.modalService.open(ExportBatchSelectorComponent);
          }
        } as OnClickMenuItemModel,
        shouldPersistOnRouteChange: true
      });
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'export_batch',
        parentID: 'export',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.export_batch',
          function: () => {
            this.modalService.open(ExportBatchSelectorComponent);
          }
        } as OnClickMenuItemModel,
        shouldPersistOnRouteChange: true
      });
    });
  }

  /**
   * Add the DL Exporter menu item to the admin menu
   */
  createDLExporterMenuItem() {
    this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      filter((authorized: boolean) => authorized),
      take(1),
      switchMap(() => observableCombineLatest([
        this.getDLExporterURL(),
        this.getDLExporterAccessToken()
      ])),
      filter(([url, accesstoken]) => isNotEmpty(url) && isNotEmpty(accesstoken)),
      take(1)
    ).subscribe(([url, accesstoken]) => {
      const urlSegments = url.split('?');
      const queryParamSegments = urlSegments[1].split('=');
      this.menuService.addSection(MenuID.ADMIN,
        {
          id: 'loginmiur_dlexporter_url',
          index: 15,
          active: false,
          visible: true,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.loginmiur_dlexporter_url',
            disabled: false,
            link: urlSegments[0],
            queryParams: {
              [queryParamSegments[0]]: queryParamSegments[1]
            }
          } as LinkMenuItemModel,
          icon: 'fa-solid fa-arrows-spin',
          shouldPersistOnRouteChange: true
        }
      );
    });
  }

  /**
   * Create menu sections dependent on whether or not the current user is a site administrator and on whether or not
   * the import scripts exist and the current user is allowed to execute them
   */
  createImportMenuSections() {
    const menuList = [];
    menuList.forEach((menuSection) => this.menuService.addSection(MenuID.ADMIN, menuSection));

    observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
    ]).pipe(
      filter(([isAdmin, isCommunityAdmin, isCollectionAdmin]) =>
        isAdmin || isCollectionAdmin || isCommunityAdmin
      ),
      take(1),
      switchMap(() => this.scriptDataService.scriptWithNameExistsAndCanExecute(METADATA_IMPORT_SCRIPT_NAME)),
      filter((metadataImportScriptExists: boolean) => metadataImportScriptExists),
      take(1)
    ).subscribe(() => {
      // Hides the import menu for unauthorised people
      // If in the future more sub-menus are added,
      // it should be reviewed if they need to be in this subscribe
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'import',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.import'
        } as TextMenuItemModel,
        icon: 'file-import',
        index: 2,
        shouldPersistOnRouteChange: true,
      });
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'import_metadata',
        parentID: 'import',
        active: true,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.import_metadata',
          link: '/admin/metadata-import'
        } as LinkMenuItemModel,
        shouldPersistOnRouteChange: true
      });
      this.menuService.addSection(MenuID.ADMIN, {
        id: 'import_batch',
        parentID: 'import',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.import_batch',
          link: '/admin/batch-import'
        } as LinkMenuItemModel,
        shouldPersistOnRouteChange: true
      });
    });
  }

  /**
   * Create menu sections dependent on whether or not the current user is a site administrator
   */
  createSiteAdministratorMenuSections() {
    this.authorizationService.isAuthorized(FeatureID.AdministratorOf).subscribe((authorized) => {
      const menuList = [
        /* Communities & Collections */
        {
          id: 'browse_global_communities_and_collections',
          active: false,
          visible: authorized && !environment.layout.navbar.showCommunityCollection,
          model: {
            type: MenuItemType.LINK,
            text: `menu.section.communities_and_collections`,
            link: `/community-list`
          } as LinkMenuItemModel,
          icon: 'list-alt',
          index: 2
        },
        /* Notifications */
        {
          id: 'notifications',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.TEXT,
            text: 'menu.section.notifications'
          } as TextMenuItemModel,
          icon: 'bell',
          index: 4
        },
        {
          id: 'notifications_openair_broker',
          parentID: 'notifications',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.notifications_openaire_broker',
            link: '/admin/notifications/openaire-broker'
          } as LinkMenuItemModel,
        },
        {
          id: 'notifications_reciter',
          parentID: 'notifications',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.notifications_reciter',
            link: '/admin/notifications/' + NOTIFICATIONS_RECITER_SUGGESTION_PATH
          } as LinkMenuItemModel,
        },
        /*  Registries */
        {
          id: 'registries',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.TEXT,
            text: 'menu.section.registries'
          } as TextMenuItemModel,
          icon: 'list',
          index: 6
        },
        {
          id: 'registries_metadata',
          parentID: 'registries',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.registries_metadata',
            link: 'admin/registries/metadata'
          } as LinkMenuItemModel,
        },
        {
          id: 'registries_format',
          parentID: 'registries',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.registries_format',
            link: 'admin/registries/bitstream-formats'
          } as LinkMenuItemModel,
        },

        /* Curation tasks */
        {
          id: 'curation_tasks',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.curation_task',
            link: 'admin/curation-tasks'
          } as LinkMenuItemModel,
          icon: 'filter',
          index: 7
        },

        /* Workflow */
        {
          id: 'workflow',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.workflow',
            link: '/admin/workflow'
          } as LinkMenuItemModel,
          icon: 'user-check',
          index: 11
        },
        {
          id: 'system_wide_alert',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.system-wide-alert',
            link: '/admin/system-wide-alert'
          } as LinkMenuItemModel,
          icon: 'exclamation-circle',
          index: 12
        },
        /* User agreement edit*/
        {
          id: 'user_agreement_edit',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.edit_user_agreement',
            link: '/admin/edit-user-agreement'
          } as LinkMenuItemModel,
          icon: 'list-alt',
          index: 13
        },
        /* CMS edit menu entry */
        {
          id: 'metadata_cms_edit',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.cms_metadata_edit',
            link: '/admin/edit-cms-metadata'
          } as LinkMenuItemModel,
          icon: 'edit',
          index: 14
        },
      ];

      menuList.forEach((menuSection) => this.menuService.addSection(MenuID.ADMIN, Object.assign(menuSection, {
        shouldPersistOnRouteChange: true
      })));
    });
  }

  /**
   * Create menu sections dependent on whether or not the current user can manage access control groups
   */
  createAccessControlMenuSections() {
    observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.authorizationService.isAuthorized(FeatureID.CanManageGroups)
    ]).subscribe(([isSiteAdmin, canManageGroups]) => {
      const menuList = [
        /* Access Control */
        {
          id: 'access_control_people',
          parentID: 'access_control',
          active: false,
          visible: isSiteAdmin,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.access_control_people',
            link: '/access-control/epeople'
          } as LinkMenuItemModel,
        },
        {
          id: 'access_control_groups',
          parentID: 'access_control',
          active: false,
          visible: canManageGroups,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.access_control_groups',
            link: '/access-control/groups'
          } as LinkMenuItemModel,
        },
        {
          id: 'access_control_bulk',
          parentID: 'access_control',
          active: false,
          visible: isSiteAdmin,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.access_control_bulk',
            link: '/access-control/bulk-access'
          } as LinkMenuItemModel,
        },
        // TODO: enable this menu item once the feature has been implemented
        // {
        //   id: 'access_control_authorizations',
        //   parentID: 'access_control',
        //   active: false,
        //   visible: authorized,
        //   model: {
        //     type: MenuItemType.LINK,
        //     text: 'menu.section.access_control_authorizations',
        //     link: ''
        //   } as LinkMenuItemModel,
        // },
        {
          id: 'access_control',
          active: false,
          visible: canManageGroups || isSiteAdmin,
          model: {
            type: MenuItemType.TEXT,
            text: 'menu.section.access_control'
          } as TextMenuItemModel,
          icon: 'key',
          index: 4
        },
      ];

      menuList.forEach((menuSection) => this.menuService.addSection(MenuID.ADMIN, Object.assign(menuSection, {
        shouldPersistOnRouteChange: true,
      })));
    });
  }

  /**
   *  Get activated route of the deepest activated route
   */
  getActivatedRoute(route) {
    if (route.children.length > 0) {
      return this.getActivatedRoute(route.firstChild);
    } else {
      return route;
    }
  }

  /**
   *  Checking authorization for Usage
   */
  getAuthorizedUsageStatistics() {
    return this.activatedRouteLastChild.data.pipe(
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
    return this.activatedRouteLastChild.data.pipe(
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
    return this.activatedRouteLastChild.data.pipe(
      switchMap((data) => {
        return this.authorizationService.isAuthorized(FeatureID.CanViewWorkflowStatistics, this.getObjectUrl(data)).pipe(
          map((canViewWorkflowStatistics: boolean) => {
            return canViewWorkflowStatistics;
          }));
      })
    );
  }

  /**
   *  Get statistics route dso data
   */
  getObjectUrl(data) {
    const object = data.site ? data.site : data.dso?.payload;
    return object?._links?.self?.href;
  }

  /**
   * Get the DL Exporter URL from the configuration
   */
  getDLExporterURL(): Observable<string> {
   return this.configService.findByPropertyName('loginmiur.dlexporter.url').pipe(
      getFirstCompletedRemoteData(),
      map((res: RemoteData<ConfigurationProperty>) => {
        return res?.payload?.values[0];
      })
    );
  }

  private getDLExporterAccessToken() {
    return this.configService.findByPropertyName('loginmiur.dlexporter.accesstoken').pipe(
      getFirstCompletedRemoteData(),
      map((res: RemoteData<ConfigurationProperty>) => {
        return res?.payload?.values[0];
      })
    );
  }
}
