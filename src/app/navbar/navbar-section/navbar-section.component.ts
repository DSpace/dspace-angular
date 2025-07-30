import { NgComponentOutlet } from '@angular/common';
import {
  Component,
  Injector,
  OnInit,
} from '@angular/core';

import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/menu-id.model';
import { rendersSectionForMenu } from '../../shared/menu/menu-section.decorator';
import { AbstractMenuSectionComponent } from '../../shared/menu/menu-section/abstract-menu-section.component';
import { ThemeService } from '../../shared/theme-support/theme.service';

/**
 * Represents a non-expandable section in the navbar
 */
@Component({
  selector: 'ds-navbar-section',
  templateUrl: './navbar-section.component.html',
  styleUrls: ['./navbar-section.component.scss'],
  standalone: true,
  imports: [
    NgComponentOutlet,
  ],
})
@rendersSectionForMenu(MenuID.PUBLIC, false)
export class NavbarSectionComponent extends AbstractMenuSectionComponent implements OnInit {
  /**
   * This section resides in the Public Navbar
   */
  menuID = MenuID.PUBLIC;

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    protected themeService: ThemeService,
  ) {
    super(
      menuService,
      injector,
      themeService,
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
