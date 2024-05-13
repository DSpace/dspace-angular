import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ModalBeforeDismiss } from '../interfaces/modal-before-dismiss.interface';
import { ThemedLoadingComponent } from '../loading/themed-loading.component';

@Component({
  selector: 'ds-item-withdrawn-reinstate-modal',
  templateUrl: './item-withdrawn-reinstate-modal.component.html',
  styleUrls: ['./item-withdrawn-reinstate-modal.component.scss'],
  imports: [
    NgIf,
    TranslateModule,
    ThemedLoadingComponent,
    FormsModule,
    AsyncPipe,
  ],
  standalone: true,
})
/**
 * Represents a modal component for withdrawing or reinstating an item.
 * Implements the ModalBeforeDismiss interface.
 */
export class ItemWithdrawnReinstateModalComponent implements ModalBeforeDismiss {

  /**
   * The reason for withdrawing or reinstating a suggestion.
   */
  reason: string;
  /**
   * Indicates whether the item can be withdrawn.
   */
  canWithdraw: boolean;
  /**
   * BehaviorSubject that represents the submitted state.
   * Emits a boolean value indicating whether the form has been submitted or not.
   */
  submitted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Event emitter for creating a QA event.
   * @event createQAEvent
   */
  @Output() createQAEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    protected activeModal: NgbActiveModal,
    protected authorizationService: AuthorizationDataService,
  ) {}

  /**
   * Closes the modal.
   */
  onModalClose() {
    this.activeModal.close();
  }

  /**
   * Determines whether the modal can be dismissed.
   * @returns {boolean} True if the modal can be dismissed, false otherwise.
   */
  beforeDismiss(): boolean {
    // prevent the modal from being dismissed after version creation is initiated
    return !this.submitted$.getValue();
  }

  /**
   * Handles the submission of the modal form.
   * Emits the reason for withdrawal or reinstatement through the createQAEvent output.
   */
  onModalSubmit() {
    this.submitted$.next(true);
    this.createQAEvent.emit(this.reason);
  }

  /**
   * Sets the withdrawal state of the component.
   * @param state The new withdrawal state.
   */
  public setWithdraw(state: boolean) {
    this.canWithdraw = state;
  }
}
