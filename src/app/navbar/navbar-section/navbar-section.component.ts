import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';

import { MenuService } from '../../shared/menu/menu.service';
import { MenuID } from '../../shared/menu/menu-id.model';
import { MenuSection } from '../../shared/menu/menu-section.model';
import { AbstractMenuSectionComponent } from '../../shared/menu/menu-section/abstract-menu-section.component';

/**
 * Represents a non-expandable section in the navbar
 */
@Component({
  selector: 'ds-navbar-section',
  templateUrl: './navbar-section.component.html',
  styleUrls: ['./navbar-section.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgComponentOutlet,
  ],
})
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
