import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MenuComponent } from '../../menu/menu.component';
import { MenuComponentLoaderComponent } from '../../menu/menu-component-loader/menu-component-loader.component';
import { MenuID } from '../../menu/menu-id.model';

/**
 * Component representing the edit menu and other menus on the dspace object pages
 */
@Component({
  selector: 'ds-dso-edit-menu',
  styleUrls: ['./dso-edit-menu.component.scss'],
  templateUrl: './dso-edit-menu.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MenuComponentLoaderComponent,
  ],
})
export class DsoEditMenuComponent extends MenuComponent {
  /**
   * The menu ID of this component is DSO_EDIT
   * @type {MenuID.DSO_EDIT}
   */
  menuID = MenuID.DSO_EDIT;

}
