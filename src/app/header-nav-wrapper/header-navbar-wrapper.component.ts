import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

import { ThemedHeaderComponent } from '../header/themed-header.component';
import { ThemedNavbarComponent } from '../navbar/themed-navbar.component';
import {
  HostWindowService,
  WidthCategory,
} from '../shared/host-window.service';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/menu-id.model';

/**
 * This component represents a wrapper for the horizontal navbar and the header
 */
@Component({
  selector: 'ds-base-header-navbar-wrapper',
  styleUrls: ['header-navbar-wrapper.component.scss'],
  templateUrl: 'header-navbar-wrapper.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    ThemedHeaderComponent,
    ThemedNavbarComponent,
  ],
})
export class HeaderNavbarWrapperComponent implements OnInit {
  public isNavBarCollapsed$: Observable<boolean>;
  public isMobile$: Observable<boolean>;

  menuID = MenuID.PUBLIC;
  maxMobileWidth = WidthCategory.SM;

  constructor(
    private menuService: MenuService,
    protected windowService: HostWindowService,
  ) {
  }

  ngOnInit(): void {
    this.isMobile$ = this.windowService.isUpTo(this.maxMobileWidth);
    this.isNavBarCollapsed$ = this.menuService.isMenuCollapsed(this.menuID);
  }

}
