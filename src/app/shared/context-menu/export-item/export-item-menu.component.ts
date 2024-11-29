import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { Item } from '../../../core/shared/item.model';
import {
  ItemExportFormConfiguration,
  ItemExportService,
} from '../../search/item-export/item-export.service';
import { ItemExportComponent } from '../../search/item-export/item-export/item-export.component';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-export-item',
  templateUrl: './export-item-menu.component.html',
  standalone: true,
  imports: [NgIf, TranslateModule, AsyncPipe],
})
export class ExportItemMenuComponent extends ContextMenuEntryComponent implements OnInit {

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
  configuration$: BehaviorSubject<ItemExportFormConfiguration> = new BehaviorSubject<ItemExportFormConfiguration>(null);

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private modalService: NgbModal,
    protected itemExportService: ItemExportService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.ExportItem);
  }

  ngOnInit() {
    if (this.contextMenuObject) {
      this.itemExportService.initialItemExportFormConfiguration(this.contextMenuObject as Item).pipe(take(1))
        .subscribe((config: ItemExportFormConfiguration) => this.configuration$.next(config));
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
