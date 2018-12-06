import { Component, Injector, OnInit } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID, SectionType } from '../shared/menu/initial-menus-state';
import { TextSectionTypeModel } from '../shared/menu/models/section-types/text.model';
import { LinkSectionTypeModel } from '../shared/menu/models/section-types/link.model';
import { HostWindowService } from '../shared/host-window.service';

@Component({
  selector: 'ds-navbar',
  styleUrls: ['navbar.component.scss'],
  templateUrl: 'navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends MenuComponent implements OnInit {
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

  createMenu() {
    const menuList = [
      /* News */
      {
        id: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: SectionType.TEXT,
          text: 'admin.sidebar.section.browse_global'
        } as TextSectionTypeModel,
      },
      {
        id: 'browse_global_communities_and_collections',
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: SectionType.LINK,
          text: 'admin.sidebar.section.browse_global_communities_and_collections',
          link: '#'
        } as LinkSectionTypeModel,
      },
      {
        id: 'browse_global_global_by_issue_date',
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: SectionType.LINK,
          text: 'admin.sidebar.section.browse_global_by_issue_date',
          link: '#'
        } as LinkSectionTypeModel,
      },
      {
        id: 'browse_global_by_author',
        parentID: 'browse_global',
        active: false,
        visible: true,
        model: {
          type: SectionType.LINK,
          text: 'admin.sidebar.section.browse_global_by_author',
          link: '#'
        } as LinkSectionTypeModel,
      },

      /* Statistics */
      {
        id: 'statistics',
        active: false,
        visible: true,
        model: {
          type: SectionType.LINK,
          text: 'admin.sidebar.section.statistics',
          link: '#'
        } as LinkSectionTypeModel,
      },
    ];
    menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, menuSection));

  }

}
