import { NgIf } from '@angular/common';
import {
  Component,
  Inject,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { Item } from '../../../core/shared/item.model';
import { getItemFullPageRoute } from '../../../item-page/item-page-routing-paths';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-full-item',
  templateUrl: './full-item-menu.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    TranslateModule,
  ],
})
export class FullItemMenuComponent extends ContextMenuEntryComponent {

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private router: Router,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.FullItem);
  }

  getItemFullPageRoute(object: DSpaceObject): string {
    return getItemFullPageRoute(object as Item);
  }

  isSameView(object: DSpaceObject): boolean {
    return this.router.url === getItemFullPageRoute(object as Item);
  }

}
