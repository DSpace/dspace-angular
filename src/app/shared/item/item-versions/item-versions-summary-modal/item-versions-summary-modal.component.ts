import { Component, EventEmitter, Output } from '@angular/core';
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

  @Output() createVersionEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    protected activeModal: NgbActiveModal,
  ) {
  }

  onModalClose() {
    this.activeModal.dismiss();
  }

  onModalSubmit() {
    this.createVersionEvent.emit(this.newVersionSummary);
    this.activeModal.close();
  }

}
