import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../environments/environment';
import { AppState } from '../../app.reducer';
import { LogOutAction } from '../../core/auth/auth.actions';
import { AuthService } from '../../core/auth/auth.service';
import { hasValue } from '../empty.util';

@Component({
  selector: 'ds-idle-modal',
  templateUrl: 'idle-modal.component.html',
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class IdleModalComponent implements OnInit {

  /**
   * Total time of idleness before session expires (in minutes)
   * (environment.auth.ui.timeUntilIdle + environment.auth.ui.idleGracePeriod / 1000 / 60)
   */
  timeToExpire: number;

  /**
   * Timer to track time grace period
   */
  private graceTimer;

  /**
   * An event fired when the modal is closed
   */
  @Output()
  response = new EventEmitter<boolean>();

  constructor(private activeModal: NgbActiveModal,
              private authService: AuthService,
              private store: Store<AppState>) {
    this.timeToExpire = (environment.auth.ui.timeUntilIdle + environment.auth.ui.idleGracePeriod) / 1000 / 60; // ms => min
  }

  ngOnInit() {
    if (hasValue(this.graceTimer)) {
      clearTimeout(this.graceTimer);
    }
    this.graceTimer = setTimeout(() => {
      this.logOutPressed();
    }, environment.auth.ui.idleGracePeriod);
  }

  /**
   * When extend session is pressed
   */
  extendSessionPressed() {
    this.extendSessionAndCloseModal();
  }

  /**
   * Close modal and logout
   */
  logOutPressed() {
    this.closeModal();
    this.store.dispatch(new LogOutAction());
  }

  /**
   * When close is pressed
   */
  closePressed() {
    this.extendSessionAndCloseModal();
  }

  /**
   * Close the modal and extend session
   */
  extendSessionAndCloseModal() {
    if (hasValue(this.graceTimer)) {
      clearTimeout(this.graceTimer);
    }
    this.authService.setIdle(false);
    this.closeModal();
  }

  /**
   * Close the modal and set the response to true so RootComponent knows the modal was closed
   */
  closeModal() {
    this.activeModal.close();
    this.response.emit(true);
  }
}
