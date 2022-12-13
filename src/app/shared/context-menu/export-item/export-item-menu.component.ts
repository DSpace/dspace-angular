import { Component, Inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ItemExportComponent } from '../../search/item-export/item-export/item-export.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { ItemExportFormConfiguration, ItemExportService } from '../../search/item-export/item-export.service';
import { take } from 'rxjs/operators';
import { Item } from '../../../core/shared/item.model';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-export-item',
  templateUrl: './export-item-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM, true)
export class ExportItemMenuComponent extends ContextMenuEntryComponent {

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {modalService} modalService
   * @param {itemExportService} itemExportService
   */

  /**
   * Type of configuration in current component
   */
  configuration: ItemExportFormConfiguration;
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private modalService: NgbModal,
    protected itemExportService: ItemExportService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ExportItem);
  }

  ngOnInit() {
    if (this.contextMenuObject) {
      this.itemExportService.initialItemExportFormConfiguration(this.contextMenuObject as Item).pipe(take(1))
      .subscribe( configuration => {
        this.configuration = configuration;
      });
    }
  }

  /**
   * Open the export modal
   */
  openExportModal() {
    if (this.contextMenuObject) {
      // open a single item-export modal
      const modalRef = this.modalService.open(ItemExportComponent);
      modalRef.componentInstance.molteplicity = ItemExportFormatMolteplicity.SINGLE;
      modalRef.componentInstance.item = this.contextMenuObject;
      modalRef.componentInstance.showListSelection = false;
    }
  }

}
