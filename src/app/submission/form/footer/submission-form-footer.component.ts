import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionService } from '../../submission.service';
import { SubmissionState } from '../../submission.reducers';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveSubmissionFormAction } from '../../objects/submission-objects.actions';

@Component({
  selector: 'ds-submission-submit-form-footer',
  styleUrls: ['./submission-form-footer.component.scss'],
  templateUrl: './submission-form-footer.component.html'
})
export class SubmissionFormFooterComponent implements OnChanges {

  @Input() submissionId;

  public saving = false;
  private submissionIsInvalid = true;

  constructor(private modalService: NgbModal,
              private restService: SubmissionRestService,
              private router: Router,
              private submissionService: SubmissionService,
              private store: Store<SubmissionState>) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.submissionId) {
      this.submissionService.getSectionsState(this.submissionId)
        .subscribe((isValid) => {
          this.submissionIsInvalid = isValid === false;
        });
      this.submissionService.getSubmissionSaveStatus(this.submissionId)
        .subscribe((status: boolean) => {
          this.saving = status
        });
    }
  }

  saveLater(event) {
    this.saving = true
    this.store.dispatch(new SaveSubmissionFormAction(this.submissionId));
  }

  public resourceDeposit() {
    alert('Feature is actually in development...');
  }

  protected resourceDiscard() {
    this.router.navigate(['/mydspace']);
  }

  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.restService.deleteById(this.submissionId)
            .subscribe((response) => {
              this.resourceDiscard();
            })
        }
      }
    );
  }
}
