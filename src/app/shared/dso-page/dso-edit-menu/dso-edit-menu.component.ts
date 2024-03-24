import {
  AsyncPipe,
  NgComponentOutlet,
  NgFor,
} from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';

import { MenuComponent } from '../../menu/menu.component';
import { MenuService } from '../../menu/menu.service';
import { MenuID } from '../../menu/menu-id.model';
import { ThemeService } from '../../theme-support/theme.service';

/**
 * Component representing the edit menu and other menus on the dspace object pages
 */
@Component({
  selector: 'ds-dso-edit-menu',
  styleUrls: ['./dso-edit-menu.component.scss'],
  templateUrl: './dso-edit-menu.component.html',
  standalone: true,
  imports: [NgFor, NgComponentOutlet, AsyncPipe],
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
              protected themeService: ThemeService,
  ) {
    super(menuService, injector, authorizationService, route, themeService);
  }

}
