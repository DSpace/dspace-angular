import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { isNotEmpty } from '../../../shared/empty.util';

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
  private submissionIsInvalid: Observable<boolean> = observableOf(true);

  constructor(private modalService: NgbModal,
              private restService: SubmissionRestService,
              private submissionService: SubmissionService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isNotEmpty(this.submissionId)) {
      this.submissionIsInvalid = this.submissionService.getSubmissionStatus(this.submissionId).pipe(
        map((isValid: boolean) => isValid === false)
      );

      this.processingSaveStatus = this.submissionService.getSubmissionSaveProcessingStatus(this.submissionId);
      this.processingDepositStatus = this.submissionService.getSubmissionDepositProcessingStatus(this.submissionId);
      this.showDepositAndDiscard = observableOf(this.submissionService.getSubmissionScope() === SubmissionScopeType.WorkspaceItem);
    }
  }

  save(event) {
    this.submissionService.dispatchSave(this.submissionId);
  }

  saveLater(event) {
    this.submissionService.dispatchSaveForLater(this.submissionId);
  }

  public deposit(event) {
    this.submissionService.dispatchDeposit(this.submissionId);
  }

  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.submissionService.dispatchDiscard(this.submissionId)
        }
      }
    );
  }
}
