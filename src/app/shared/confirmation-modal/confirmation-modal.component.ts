import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ds-confirmation-modal',
    templateUrl: 'confirmation-modal.component.html',
    standalone: true,
    imports: [NgIf, TranslateModule]
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

  @Input() dso: DSpaceObject;

  /**
   * An event fired when the cancel or confirm button is clicked, with respectively false or true
   */
  @Output()
  response = new EventEmitter<boolean>();

  constructor(
    protected activeModal: NgbActiveModal,
    public dsoNameService: DSONameService,
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
