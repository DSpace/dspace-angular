import { Component, Injector, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { slideHorizontal, slideSidebar } from '../../shared/animations/slide';
import { CreateCollectionParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';
import { CreateCommunityParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component';
import { CreateItemParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { EditCollectionSelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component';
import { EditCommunitySelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';
import { EditItemSelectorComponent } from '../../shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';
import { ExportMetadataSelectorComponent } from '../../shared/dso-selector/modal-wrappers/export-metadata-selector/export-metadata-selector.component';
import { MenuID, MenuItemType } from '../../shared/menu/initial-menus-state';
import { LinkMenuItemModel } from '../../shared/menu/menu-item/models/link.model';
import { OnClickMenuItemModel } from '../../shared/menu/menu-item/models/onclick.model';
import { TextMenuItemModel } from '../../shared/menu/menu-item/models/text.model';
import { MenuComponent } from '../../shared/menu/menu.component';
import { MenuService } from '../../shared/menu/menu.service';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';

/**
 * Component representing the admin sidebar
 */
@Component({
  selector: 'ds-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  animations: [slideHorizontal, slideSidebar]
})
export class AdminSidebarComponent extends MenuComponent implements OnInit {
  /**
   * The menu ID of the Navbar is PUBLIC
   * @type {MenuID.ADMIN}
   */
  menuID = MenuID.ADMIN;

  /**
   * Observable that emits the width of the collapsible menu sections
   */
  sidebarWidth: Observable<string>;

  /**
   * Is true when the sidebar is open, is false when the sidebar is animating or closed
   * @type {boolean}
   */
  sidebarOpen = true; // Open in UI, animation finished

  /**
   * Is true when the sidebar is closed, is false when the sidebar is animating or open
   * @type {boolean}
   */
  sidebarClosed = !this.sidebarOpen; // Closed in UI, animation finished

  /**
   * Emits true when either the menu OR the menu's preview is expanded, else emits false
   */
  sidebarExpanded: Observable<boolean>;

  constructor(protected menuService: MenuService,
              protected injector: Injector,
              private variableService: CSSVariableService,
              private authService: AuthService,
              private modalService: NgbModal,
              private authorizationService: AuthorizationDataService,
              private scriptDataService: ScriptDataService,
  ) {
    super(menuService, injector);
  }

  /**
   * Set and calculate all initial values of the instance variables
   */
  ngOnInit(): void {
    this.createMenu();
    this.createSiteAdministratorMenuSections();
    this.createExportMenuSections();
    this.createImportMenuSections();
    super.ngOnInit();
    this.sidebarWidth = this.variableService.getVariable('sidebarItemsWidth');
    this.authService.isAuthenticated()
      .subscribe((loggedIn: boolean) => {
        if (loggedIn) {
          this.menuService.showMenu(this.menuID);
        }
      });
    this.menuCollapsed.pipe(first())
      .subscribe((collapsed: boolean) => {
        this.sidebarOpen = !collapsed;
        this.sidebarClosed = collapsed;
      });
    this.sidebarExpanded = observableCombineLatest(this.menuCollapsed, this.menuPreviewCollapsed)
      .pipe(
        map(([collapsed, previewCollapsed]) => (!collapsed || !previewCollapsed))
      );
  }

  /**
   * Initialize all menu sections and items for this menu
   */
  createMenu() {
    const menuList = [
      /* News */
      {
        id: 'new',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.new'
        } as TextMenuItemModel,
        icon: 'plus-circle',
        index: 0
      },
      {
        id: 'new_community',
        parentID: 'new',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.new_community',
          function: () => {
            this.modalService.open(CreateCommunityParentSelectorComponent);
          }
        } as OnClickMenuItemModel,
      },
      {
        id: 'new_collection',
        parentID: 'new',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.new_collection',
          function: () => {
            this.modalService.open(CreateCollectionParentSelectorComponent);
          }
        } as OnClickMenuItemModel,
      },
      {
        id: 'new_item',
        parentID: 'new',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.new_item',
          function: () => {
            this.modalService.open(CreateItemParentSelectorComponent);
          }
        } as OnClickMenuItemModel,
      },
      {
        id: 'new_process',
        parentID: 'new',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.new_process',
          link: '/processes/new'
        } as LinkMenuItemModel,
      },
      {
        id: 'new_item_version',
        parentID: 'new',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.new_item_version',
          link: ''
        } as LinkMenuItemModel,
      },

      /* Edit */
      {
        id: 'edit',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.edit'
        } as TextMenuItemModel,
        icon: 'pencil-alt',
        index: 1
      },
      {
        id: 'edit_community',
        parentID: 'edit',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.edit_community',
          function: () => {
            this.modalService.open(EditCommunitySelectorComponent);
          }
        } as OnClickMenuItemModel,
      },
      {
        id: 'edit_collection',
        parentID: 'edit',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.edit_collection',
          function: () => {
            this.modalService.open(EditCollectionSelectorComponent);
          }
        } as OnClickMenuItemModel,
      },
      {
        id: 'edit_item',
        parentID: 'edit',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.edit_item',
          function: () => {
            this.modalService.open(EditItemSelectorComponent);
          }
        } as OnClickMenuItemModel,
      },

      /* Curation tasks */
      {
        id: 'curation_tasks',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.curation_task',
          link: ''
        } as LinkMenuItemModel,
        icon: 'filter',
        index: 7
      },

      /* Statistics */
      {
        id: 'statistics_task',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.statistics_task',
          link: ''
        } as LinkMenuItemModel,
        icon: 'chart-bar',
        index: 8
      },

      /* Control Panel */
      {
        id: 'control_panel',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.control_panel',
          link: ''
        } as LinkMenuItemModel,
        icon: 'cogs',
        index: 9
      },

      /* Processes */
      {
        id: 'processes',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.processes',
          link: '/processes'
        } as LinkMenuItemModel,
        icon: 'terminal',
        index: 10
      },
    ];
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
      shouldPersistOnRouteChange: true
    })));
  }

  /**
   * Create menu sections dependent on whether or not the current user is a site administrator and on whether or not
   * the export scripts exist and the current user is allowed to execute them
   */
  createExportMenuSections() {
    const menuList = [
      /* Export */
      {
        id: 'export',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.export'
        } as TextMenuItemModel,
        icon: 'sign-out-alt',
        index: 3,
        shouldPersistOnRouteChange: true
      },
      {
        id: 'export_community',
        parentID: 'export',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.export_community',
          link: ''
        } as LinkMenuItemModel,
        shouldPersistOnRouteChange: true
      },
      {
        id: 'export_collection',
        parentID: 'export',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.export_collection',
          link: ''
        } as LinkMenuItemModel,
        shouldPersistOnRouteChange: true
      },
      {
        id: 'export_item',
        parentID: 'export',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.export_item',
          link: ''
        } as LinkMenuItemModel,
        shouldPersistOnRouteChange: true
      },
    ];
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, menuSection));

    observableCombineLatest(
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      // this.scriptDataService.scriptWithNameExistsAndCanExecute(METADATA_EXPORT_SCRIPT_NAME)
    ).pipe(
      // TODO uncomment when #635 (https://github.com/DSpace/dspace-angular/issues/635) is fixed; otherwise even in production mode, the metadata export button is only available after a refresh (and not in dev mode)
      // filter(([authorized, metadataExportScriptExists]: boolean[]) => authorized && metadataExportScriptExists),
      take(1)
    ).subscribe(() => {
      this.menuService.addSection(this.menuID, {
        id: 'export_metadata',
        parentID: 'export',
        active: true,
        visible: true,
        model: {
          type: MenuItemType.ONCLICK,
          text: 'menu.section.export_metadata',
          function: () => {
            this.modalService.open(ExportMetadataSelectorComponent);
          }
        } as OnClickMenuItemModel,
        shouldPersistOnRouteChange: true
      });
    });
  }

  /**
   * Create menu sections dependent on whether or not the current user is a site administrator and on whether or not
   * the import scripts exist and the current user is allowed to execute them
   */
  createImportMenuSections() {
    const menuList = [
      /* Import */
      {
        id: 'import',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.import'
        } as TextMenuItemModel,
        icon: 'sign-in-alt',
        index: 2
      },
      {
        id: 'import_batch',
        parentID: 'import',
        active: false,
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.import_batch',
          link: ''
        } as LinkMenuItemModel,
      }
    ];
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
      shouldPersistOnRouteChange: true
    })));

    observableCombineLatest(
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      // this.scriptDataService.scriptWithNameExistsAndCanExecute(METADATA_IMPORT_SCRIPT_NAME)
    ).pipe(
      // TODO uncomment when #635 (https://github.com/DSpace/dspace-angular/issues/635) is fixed
      // filter(([authorized, metadataImportScriptExists]: boolean[]) => authorized && metadataImportScriptExists),
      take(1)
    ).subscribe(() => {
      this.menuService.addSection(this.menuID, {
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
    });
  }

  /**
   * Create menu sections dependent on whether or not the current user is a site administrator
   */
  createSiteAdministratorMenuSections() {
    this.authorizationService.isAuthorized(FeatureID.AdministratorOf).subscribe((authorized) => {
      const menuList = [
        /* Access Control */
        {
          id: 'access_control',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.TEXT,
            text: 'menu.section.access_control'
          } as TextMenuItemModel,
          icon: 'key',
          index: 4
        },
        {
          id: 'access_control_people',
          parentID: 'access_control',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.access_control_people',
            link: '/admin/access-control/epeople'
          } as LinkMenuItemModel,
        },
        {
          id: 'access_control_groups',
          parentID: 'access_control',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.access_control_groups',
            link: '/admin/access-control/groups'
          } as LinkMenuItemModel,
        },
        {
          id: 'access_control_authorizations',
          parentID: 'access_control',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.access_control_authorizations',
            link: ''
          } as LinkMenuItemModel,
        },
        /*  Admin Search */
        {
          id: 'admin_search',
          active: false,
          visible: authorized,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.admin_search',
            link: '/admin/search'
          } as LinkMenuItemModel,
          icon: 'search',
          index: 5
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
      ];

      menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
        shouldPersistOnRouteChange: true
      })));
    });
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  startSlide(event: any): void {
    if (event.toState === 'expanded') {
      this.sidebarClosed = false;
    } else if (event.toState === 'collapsed') {
      this.sidebarOpen = false;
    }
  }

  /**
   * Method to change this.collapsed to false when the slide animation ends and is sliding open
   * @param event The animation event
   */
  finishSlide(event: any): void {
    if (event.fromState === 'expanded') {
      this.sidebarClosed = true;
    } else if (event.fromState === 'collapsed') {
      this.sidebarOpen = true;
    }
  }
}
