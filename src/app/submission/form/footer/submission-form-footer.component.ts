import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionState } from '../../submission.reducers';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DepositSubmissionAction, SaveSubmissionFormAction } from '../../objects/submission-objects.actions';
import { Observable } from 'rxjs/Observable';
import { RolesService } from '../../../core/roles/roles.service';

@Component({
  selector: 'ds-submission-form-footer',
  styleUrls: ['./submission-form-footer.component.scss'],
  templateUrl: './submission-form-footer.component.html'
})
export class SubmissionFormFooterComponent implements OnChanges {

  @Input() submissionId;

  public processingDepositStatus: Observable<boolean>;
  public processingSaveStatus: Observable<boolean>;
  private submissionIsInvalid = true;

  constructor(private modalService: NgbModal,
              private restService: SubmissionRestService,
              private roles: RolesService,
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
    }
  }

  saveLater(event) {
    this.store.dispatch(new SaveSubmissionFormAction(this.submissionId));
  }

  public deposit() {
    this.store.dispatch(new DepositSubmissionAction(this.submissionId));
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
