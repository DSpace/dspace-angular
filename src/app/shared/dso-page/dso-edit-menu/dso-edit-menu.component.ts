import { Component, Injector } from '@angular/core';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { MenuID } from '../../menu/initial-menus-state';
import { MenuComponent } from '../../menu/menu.component';
import { MenuService } from '../../menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

/**
 * Component representing the edit menu and other menus on the dspace object pages
 */
@Component({
  selector: 'ds-dso-edit-menu',
  styleUrls: ['./dso-edit-menu.component.scss'],
  templateUrl: './dso-edit-menu.component.html',
})
export class DsoEditMenuComponent extends MenuComponent {
  /**
   * The menu ID of this component is DSO_EDIT
   * @type {MenuID.DSO_EDIT}
   */
  menuID = MenuID.DSO_EDIT;

  constructor(protected menuService: MenuService,
              protected injector: Injector,
              public authorizationService: AuthorizationDataService,
              public route: ActivatedRoute,
              private authService: AuthService,
  ) {
    super(menuService, injector, authorizationService, route);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
