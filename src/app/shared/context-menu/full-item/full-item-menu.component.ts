import { Component, Inject } from '@angular/core';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { getItemFullPageRoute } from '../../../item-page/item-page-routing-paths';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { Item } from '../../../core/shared/item.model';
import { Router } from '@angular/router';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-full-item',
  templateUrl: './full-item-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class FullItemMenuComponent extends ContextMenuEntryComponent {

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private router: Router
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
