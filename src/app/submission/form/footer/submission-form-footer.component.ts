import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionService, WORKSPACE_SCOPE } from '../../submission.service';
import { SubmissionState } from '../../submission.reducers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormAction,
  SaveSubmissionFormAction
} from '../../objects/submission-objects.actions';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-submission-form-footer',
  styleUrls: ['./submission-form-footer.component.scss'],
  templateUrl: './submission-form-footer.component.html'
})
export class SubmissionFormFooterComponent implements OnChanges {

  @Input() submissionId;

  public processingDepositStatus: Observable<boolean>;
  public processingSaveStatus: Observable<boolean>;
  public showDepositAndDiscard: Observable<boolean>;
  private submissionIsInvalid = true;

  constructor(private modalService: NgbModal,
              private restService: SubmissionRestService,
              private submissionService: SubmissionService,
              private store: Store<SubmissionState>) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.submissionId) {
      this.submissionService.getSectionsState(this.submissionId)
        .subscribe((isValid) => {
          this.submissionIsInvalid = isValid === false;
        });

      this.processingSaveStatus = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
      this.processingDepositStatus = this.submissionService.getSubmissionDepositProcessingStatus(this.submissionId);
      this.showDepositAndDiscard = Observable.of(this.submissionService.getSubmissionScope() === WORKSPACE_SCOPE);
    }
  }

  save(event) {
    this.store.dispatch(new SaveSubmissionFormAction(this.submissionId));
  }

  saveLater(event) {
    this.store.dispatch(new SaveForLaterSubmissionFormAction(this.submissionId));
  }

  public deposit(event) {
    this.store.dispatch(new SaveAndDepositSubmissionAction(this.submissionId));
  }

  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.restService.deleteById(this.submissionId)
            .subscribe((response) => {
              this.submissionService.redirectToMyDSpace();
            })
        }
      }
    );
  }
}
