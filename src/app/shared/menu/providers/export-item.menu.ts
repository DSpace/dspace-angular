/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { ItemExportFormatMolteplicity } from '@dspace/core/itemexportformat/item-export-format.service';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import {
  ItemExportFormConfiguration,
  ItemExportService,
} from '../../search/item-export/item-export.service';
import { ItemExportComponent } from '../../search/item-export/item-export/item-export.component';
import { OnClickMenuItemModel } from '../menu-item/models/onclick.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider that adds an "Export Item" action to the DSO public menu.
 * Available to all users (including unauthenticated), visibility depends on whether
 * export formats are configured for the item's entity type.
 */
@Injectable()
export class ExportItemMenuProvider extends DSpaceObjectPageMenuProvider {

  constructor(
    private modalService: NgbModal,
    private itemExportService: ItemExportService,
  ) {
    super();
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    if (!(dso instanceof Item)) {
      return of([]);
    }

    const item = dso as Item;

    return this.itemExportService.initialItemExportFormConfiguration(item).pipe(
      take(1),
      map((config: ItemExportFormConfiguration) => {
        const hasFormats = config?.formats?.length > 0;

        return [
          {
            visible: hasFormats,
            model: {
              type: MenuItemType.ONCLICK,
              text: 'context-menu.actions.export-item.btn',
              disabled: false,
              function: () => {
                this.openExportModal(item);
              },
            } as OnClickMenuItemModel,
            icon: 'file-export',
          },
        ] as PartialMenuSection[];
      }),
    );
  }

  /**
   * Open the export modal for the given item
   */
  private openExportModal(item: Item): void {
    const modalRef = this.modalService.open(ItemExportComponent);
    modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.SINGLE;
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.showListSelection = false;
  }
}
