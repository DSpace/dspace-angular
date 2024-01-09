import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminNotifyMessage } from '../models/admin-notify-message.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-admin-notify-detail-modal',
  templateUrl: './admin-notify-detail-modal.component.html',
})
export class AdminNotifyDetailModalComponent {
  @Input() notifyMessage: AdminNotifyMessage;
  @Input() notifyMessageKeys: string[];

  /**
   * An event fired when the modal is closed
   */
  @Output()
  response = new EventEmitter<boolean>();


  constructor(protected activeModal: NgbActiveModal) {
  }


  /**
   * Close the modal and set the response to true so RootComponent knows the modal was closed
   */
  closeModal() {
    this.activeModal.close();
    this.response.emit(true);
  }
}
