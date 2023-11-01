import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalBeforeDismiss } from '../interfaces/modal-before-dismiss.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';

@Component({
  selector: 'ds-item-withdrawn-reinstate-modal',
  templateUrl: './item-withdrawn-reinstate-modal.component.html',
  styleUrls: ['./item-withdrawn-reinstate-modal.component.scss']
})
export class ItemWithdrawnReinstateModalComponent implements ModalBeforeDismiss {

  summary: string;

  canWithdraw$: Observable<boolean> = of(false);
  canReinstate$: Observable<boolean> = of(false);
  submitted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Output() createQAEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    protected activeModal: NgbActiveModal,
    protected authorizationService: AuthorizationDataService
  ) {}

  onModalClose() {
    this.activeModal.close();
  }

  beforeDismiss(): boolean {
    // prevent the modal from being dismissed after version creation is initiated
    return !this.submitted$.getValue();
  }

  onModalSubmit() {
    this.submitted$.next(true);
    this.createQAEvent.emit(this.summary);
  }

  public setDso(dso: DSpaceObject) {
    this.canWithdraw$ = this.authorizationService.isAuthorized(FeatureID.WithdrawItem, dso.self);
    this.canReinstate$ = this.authorizationService.isAuthorized(FeatureID.ReinstateItem, dso.self);
  }
}
