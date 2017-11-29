import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SubmissionRestService } from '../../submission-rest.service';
import { SubmissionService } from '../../submission.service';

@Component({
  selector: 'ds-submission-submit-form-footer',
  styleUrls: [ './submission-submit-form-footer.component.scss' ],
  templateUrl: './submission-submit-form-footer.component.html'
})

export class SubmissionSubmitFormFooterComponent implements OnChanges {

  @Input() submissionId;

  public submissionValid = false;

  constructor(private restService: SubmissionRestService, private submissionService: SubmissionService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!!this.submissionId) {
      this.submissionService.getSectionsState(this.submissionId)
        .subscribe((state) => {
          this.submissionValid = state;
        });
    }
  }

  getSectionsState() {
    return this.submissionService.getSectionsState(this.submissionId);
  }

  onSave() {
    this.restService.jsonPatchByResourceType(this.submissionId, 'sections')
      .subscribe((r) => {
        console.log('r', r);
      });
  }
}
