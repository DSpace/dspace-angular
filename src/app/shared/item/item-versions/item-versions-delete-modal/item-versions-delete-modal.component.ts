import { Component, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'ds-item-versions-delete-modal',
  templateUrl: './item-versions-delete-modal.component.html',
  styleUrls: ['./item-versions-delete-modal.component.scss']
})
export class ItemVersionsDeleteModalComponent {
  /**
   * An event fired when the cancel or confirm button is clicked, with respectively false or true
   */
  @Output()
  response: Subject<boolean> = new Subject();

  versionNumber: number;

  constructor(
    protected activeModal: NgbActiveModal,) {
  }

  onModalClose() {
    this.response.next(false);
    this.activeModal.dismiss();
  }

  onModalSubmit() {
    this.response.next(true);
    this.activeModal.close();
  }

}
