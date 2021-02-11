import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BulkImportSelectorComponent } from '../../../shared/dso-selector/modal-wrappers/bulk-import-collection-selector/bulk-import-collection-selector.component';

/**
 * This component represents the 'Import metadata from external source' dropdown menu
 */
@Component({
  selector: 'ds-my-dspace-new-bulk-import',
  templateUrl: './my-dspace-new-bulk-import.component.html'
})
export class MyDSpaceNewBulkImportComponent {

  constructor(private modalService: NgbModal) { }

  openDialog() {
    this.modalService.open(BulkImportSelectorComponent);
  }
}
