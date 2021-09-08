import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-item-versions-summary-modal',
  templateUrl: './item-versions-summary-modal.component.html',
  styleUrls: ['./item-versions-summary-modal.component.scss']
})
export class ItemVersionsSummaryModalComponent implements OnInit {

  versionNumber: number;
  newVersionSummary: string;

  constructor(
    protected activeModal: NgbActiveModal,
  ) {
  }

  onModalClose() {
    this.activeModal.dismiss('item.version.create.message.failure');
  }

  onModalSubmit() {
    this.activeModal.close(this.newVersionSummary);
  }

  ngOnInit(): void {
    // TODO delete if unused
  }

}
