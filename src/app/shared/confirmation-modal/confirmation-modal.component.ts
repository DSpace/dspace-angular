
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-confirmation-modal',
  templateUrl: 'confirmation-modal.component.html',
  styleUrls: ['confirmation-modal.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class ConfirmationModalComponent {
  @Input() headerLabel: string;
  @Input() infoLabel: string;
  @Input() cancelLabel: string;
  @Input() confirmLabel: string;
  @Input() confirmIcon: string;
  /**
   * The brand color of the confirm button
   */
  @Input() brandColor = 'primary';

  @Input() name: string;

  /**
   * An event fired when the cancel or confirm button is clicked, with respectively false or true
   */
  @Output()
  response = new EventEmitter<boolean>();

  constructor(
    protected activeModal: NgbActiveModal,
  ) {
  }

  /**
   * Confirm the action that led to the modal
   */
  confirmPressed() {
    this.response.emit(true);
    this.close();
  }

  /**
   * Cancel the action that led to the modal and close modal
   */
  cancelPressed() {
    this.response.emit(false);
    this.close();
  }

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
  }
}
