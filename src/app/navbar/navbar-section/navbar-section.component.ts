import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { AbstractMenuSectionComponent } from '../../shared/menu/menu-section/abstract-menu-section.component';
import { MenuService } from '../../shared/menu/menu.service';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
import { MenuID } from '../../shared/menu/menu-id.model';

/**
 * Represents a non-expandable section in the navbar
 */
@Component({
  /* eslint-disable @angular-eslint/component-selector */
  selector: 'li[ds-navbar-section]',
  templateUrl: './navbar-section.component.html',
  styleUrls: ['./navbar-section.component.scss']
})
@rendersSectionForMenu(MenuID.PUBLIC, false)
export class NavbarSectionComponent extends AbstractMenuSectionComponent implements OnInit {
  /**
   * This section resides in the Public Navbar
   */
  menuID = MenuID.PUBLIC;

  constructor(
    @Inject('sectionDataProvider') protected section: MenuSection,
    protected menuService: MenuService,
    protected injector: Injector,
  ) {
    super(menuService, injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
