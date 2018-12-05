import { Component, Inject, Injector, OnInit } from '@angular/core';
import { rotate } from '../../../shared/animations/rotate';
import { AdminSidebarSectionComponent } from '../admin-sidebar-section/admin-sidebar-section.component';
import { slide } from '../../../shared/animations/slide';
import { CSSVariableService } from '../../../shared/sass-helper/sass-helper.service';
import { bgColor } from '../../../shared/animations/bgColor';
import { MenuID } from '../../../shared/menu/initial-menus-state';
import { rendersSectionForMenu } from '../../../shared/menu/menu.decorator';
import { MenuService } from '../../../shared/menu/menu.service';
import { MenuSection } from '../../../shared/menu/menu.reducer';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'ds-expandable-admin-sidebar-section',
  templateUrl: './expandable-admin-sidebar-section.component.html',
  styleUrls: ['./expandable-admin-sidebar-section.component.scss'],
  animations: [rotate, slide, bgColor]

})
@rendersSectionForMenu(MenuID.ADMIN, true)
export class ExpandableAdminSidebarSectionComponent extends AdminSidebarSectionComponent implements OnInit {
  subSections: Observable<MenuSection[]>;
  menuID = MenuID.ADMIN;
  link = '#';
  sidebarActiveBg;
  sidebarCollapsed: Observable<boolean>;
  c = 0;
  count = new BehaviorSubject<number>(0);

  constructor(@Inject('sectionDataProvider') menuSection, protected menuService: MenuService,
              private variableService: CSSVariableService, protected injector: Injector,) {
    super(menuSection, menuService, injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subSections = this.menuService.getSubSectionsByParentID(this.menuID, this.section.id);
    // this.active.subscribe((t) => console.log('section: ', this.section.id, this.c, t));
    // this.active.subscribe((t) => this.count.next(++this.c));
    this.sidebarActiveBg = this.variableService.getVariable('adminSidebarActiveBg');
    this.sidebarCollapsed = this.menuService.isMenuCollapsed(this.menuID);
  }
}
