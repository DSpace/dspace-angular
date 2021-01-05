import { Component, Inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ItemExportComponent } from '../../item-export/item-export/item-export.component';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-export-item',
  templateUrl: './export-item-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class ExportItemMenuComponent extends ContextMenuEntryComponent {

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {modalService} modalService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private modalService: NgbModal,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType);
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
    }
  }

}
