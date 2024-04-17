import { NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-confirmation-modal',
  templateUrl: 'confirmation-modal.component.html',
  standalone: true,
  imports: [NgIf, TranslateModule, FontAwesomeModule],
})
export class ConfirmationModalComponent {
  protected readonly faTimes = faTimes;

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
