import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { slideSidebar } from '../../shared/animations/slide';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuID, SectionType } from '../../shared/menu/initial-menus-state';
import { MenuComponent } from '../../shared/menu/menu.component';
import { TextSectionTypeModel } from '../../shared/menu/models/section-types/text.model';
import { LinkSectionTypeModel } from '../../shared/menu/models/section-types/link.model';

@Component({
  selector: 'ds-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  animations: [slideSidebar]
})
export class AdminSidebarComponent extends MenuComponent implements OnInit {
  menuID = MenuID.ADMIN;
  sidebarWidth: Observable<string>;
  sidebarOpen = true;
  sidebarClosed = !this.sidebarOpen;

  constructor(protected menuService: MenuService,
              protected injector: Injector,
              private variableService: CSSVariableService) {
    super(menuService, injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.sidebarWidth = this.variableService.getVariable('adminSidebarWidth');
    this.createMenu();
  }

  createMenu() {
    const menuList = [
      /* News */
      {
        id: 'new',
        active: false,
        visible: true,
        model: { type: SectionType.TEXT, text: 'admin.sidebar.section.new' } as TextSectionTypeModel,
        icon: 'plus-circle'
      },
      {
        id: 'new_community',
        parentID: 'new',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.new_community', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'new_collection',
        parentID: 'new',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.new_collection', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'new_item',
        parentID: 'new',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.new_item', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'new_item_version',
        parentID: 'new',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.new_item_version', link: '#' } as LinkSectionTypeModel,
      },

      /* Edit */
      {
        id: 'edit',
        active: false,
        visible: true,
        model: { type: SectionType.TEXT, text: 'admin.sidebar.section.edit' } as TextSectionTypeModel,
        icon: 'pencil-alt'
      },
      {
        id: 'edit_community',
        parentID: 'edit',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.edit_community', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'edit_collection',
        parentID: 'edit',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.edit_collection', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'edit_item',
        parentID: 'edit',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.edit_item', link: '#' } as LinkSectionTypeModel,
      },

      /* Import */
      {
        id: 'import',
        active: false,
        visible: true,
        model: { type: SectionType.TEXT, text: 'admin.sidebar.section.import' } as TextSectionTypeModel,
        icon: 'sign-in-alt'
      },
      {
        id: 'import_metadata',
        parentID: 'import',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.import_metadata', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'import_batch',
        parentID: 'import',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.import_batch', link: '#' } as LinkSectionTypeModel,
      },

      /* Export */
      {
        id: 'export',
        active: false,
        visible: true,
        model: { type: SectionType.TEXT, text: 'admin.sidebar.section.export' } as TextSectionTypeModel,
        icon: 'sign-out-alt'
      },
      {
        id: 'export_community',
        parentID: 'export',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.export_community', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'export_collection',
        parentID: 'export',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.export_collection', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'export_item',
        parentID: 'export',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.export_item', link: '#' } as LinkSectionTypeModel,
      }, {
        id: 'export_metadata',
        parentID: 'export',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.export_metadata', link: '#' } as LinkSectionTypeModel,
      },

      /* Access Control */
      {
        id: 'access_control',
        active: false,
        visible: true,
        model: { type: SectionType.TEXT, text: 'admin.sidebar.section.access_control' } as TextSectionTypeModel,
        icon: 'key'
      },
      {
        id: 'access_control_people',
        parentID: 'access_control',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.access_control_people', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'access_control_groups',
        parentID: 'access_control',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.access_control_groups', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'access_control_authorizations',
        parentID: 'access_control',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.access_control_authorizations', link: '#' } as LinkSectionTypeModel,
      },

      /*  Search */
      {
        id: 'find',
        active: false,
        visible: true,
        model: { type: SectionType.TEXT, text: 'admin.sidebar.section.find' } as TextSectionTypeModel,
        icon: 'search'
      },
      {
        id: 'find_items',
        parentID: 'find',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.find_items', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'find_withdrawn_items',
        parentID: 'find',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.find_withdrawn_items', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'find_private_items',
        parentID: 'find',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.find_private_items', link: '#' } as LinkSectionTypeModel,
      },

      /*  Registries */
      {
        id: 'registries',
        active: false,
        visible: true,
        model: { type: SectionType.TEXT, text: 'admin.sidebar.section.registries' } as TextSectionTypeModel,
        icon: 'list'
      },
      {
        id: 'registries_metadata',
        parentID: 'registries',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.registries_metadata', link: '#' } as LinkSectionTypeModel,
      },
      {
        id: 'registries_format',
        parentID: 'registries',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.registries_format', link: '#' } as LinkSectionTypeModel,
      },

      /* Curation tasks */
      {
        id: 'curation_tasks',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.curation_task', link: '#'  } as LinkSectionTypeModel,
        icon: 'filter'
      },

      /* Statistics */
      {
        id: 'statistics',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.statistics', link: '#'  } as LinkSectionTypeModel,
        icon: 'chart-bar'
      },

      /* Control Panel */
      {
        id: 'control_panel',
        active: false,
        visible: true,
        model: { type: SectionType.LINK, text: 'admin.sidebar.section.control_panel', link: '#'  } as LinkSectionTypeModel,
        icon: 'cogs'
      },
    ];
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, menuSection));

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
