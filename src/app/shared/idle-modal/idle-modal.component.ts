import { Component, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { Subject } from 'rxjs';
import { hasValue } from '../empty.util';

@Component({
  selector: 'ds-idle-modal',
  templateUrl: 'idle-modal.component.html',
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
  response: Subject<boolean> = new Subject();

  constructor(private activeModal: NgbActiveModal,
              private authService: AuthService) {
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
    this.authService.logout();
    this.closeModal();
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
    this.response.next(true);
  }
}
