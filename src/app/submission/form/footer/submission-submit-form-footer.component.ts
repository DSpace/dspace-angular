import { Component, Input } from '@angular/core';
import { SubmissionRestService } from '../../submission-rest.service';

@Component({
  selector: 'ds-submission-submit-form-footer',
  styleUrls: ['./submission-submit-form-footer.component.scss'],
  templateUrl: './submission-submit-form-footer.component.html'
})

export class SubmissionSubmitFormFooterComponent {

  @Input() submissionId;

  constructor(private restService: SubmissionRestService) {}

  onDeposit() {
    this.restService.jsonPatchByResourceType(this.submissionId, 'sections')
      .subscribe((r) => {
        console.log('r', r);
      });
  }

  onSave() {
    /*this.restService.jsonPatchByResourceID(this.submissionId, 'sections', 'traditionalpagetwo')
      .subscribe((r) => {
        console.log('r', r);
      });*/
  }

  onDiscard() {
  }
}
