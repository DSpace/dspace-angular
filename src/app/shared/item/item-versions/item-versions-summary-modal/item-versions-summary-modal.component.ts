import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-item-versions-summary-modal',
  templateUrl: './item-versions-summary-modal.component.html',
  styleUrls: ['./item-versions-summary-modal.component.scss']
})
export class ItemVersionsSummaryModalComponent {

  versionNumber: number;
  newVersionSummary: string;
  firstVersion = true;

  constructor(
    protected activeModal: NgbActiveModal,
  ) {
  }

  onModalClose() {
    this.activeModal.dismiss();
  }

  onModalSubmit() {
    this.activeModal.close(this.newVersionSummary);
  }

}
