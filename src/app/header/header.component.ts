import {
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';

import { HostWindowService } from '../shared/host-window.service';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/menu-id.model';

/**
 * Represents the header with the logo and simple navigation
 */
@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public isXsOrSm$: Observable<boolean>;
  menuID = MenuID.PUBLIC;

  constructor(
    protected menuService: MenuService,
    protected windowService: HostWindowService,
  ) {
  }

  ngOnInit(): void {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
  }

  public toggleNavbar(): void {
    this.menuService.toggleMenu(this.menuID);
  }
}
