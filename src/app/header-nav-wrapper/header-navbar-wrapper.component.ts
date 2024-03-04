import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/menu-id.model';
import { ThemedNavbarComponent } from '../navbar/themed-navbar.component';
import { ThemedHeaderComponent } from '../header/themed-header.component';
import { NgClass, AsyncPipe } from '@angular/common';
import { HostWindowService, WidthCategory } from '../shared/host-window.service';

/**
 * This component represents a wrapper for the horizontal navbar and the header
 */
@Component({
    selector: 'ds-header-navbar-wrapper',
    styleUrls: ['header-navbar-wrapper.component.scss'],
    templateUrl: 'header-navbar-wrapper.component.html',
    standalone: true,
    imports: [NgClass, ThemedHeaderComponent, ThemedNavbarComponent, AsyncPipe]
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
