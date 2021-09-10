import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-item-versions-delete-modal',
  templateUrl: './item-versions-delete-modal.component.html',
  styleUrls: ['./item-versions-delete-modal.component.scss']
})
export class ItemVersionsDeleteModalComponent {

  versionNumber: number;

  constructor(
    protected activeModal: NgbActiveModal,) {
  }

  onModalClose() {
    this.activeModal.dismiss();
  }

  onModalSubmit() {
    this.activeModal.close();
  }

}
