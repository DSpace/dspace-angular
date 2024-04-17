import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-versions-delete-modal',
  templateUrl: './item-versions-delete-modal.component.html',
  styleUrls: ['./item-versions-delete-modal.component.scss'],
  standalone: true,
  imports: [TranslateModule, FontAwesomeModule],
})
export class ItemVersionsDeleteModalComponent {
  protected readonly faCheck = faCheck;
  protected readonly faTimes = faTimes;

  /**
   * An event fired when the cancel or confirm button is clicked, with respectively false or true
   */
  @Output()
    response = new EventEmitter<boolean>();

  versionNumber: number;

  constructor(
    protected activeModal: NgbActiveModal) {
  }

  onModalClose() {
    this.response.emit(false);
    this.activeModal.dismiss();
  }

  onModalSubmit() {
    this.response.emit(true);
    this.activeModal.close();
  }
}
