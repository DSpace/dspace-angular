import { Component } from '@angular/core';

import { ThemedMyDSpaceNewExternalDropdownComponent } from '../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-external-dropdown/themed-my-dspace-new-external-dropdown.component';
import { MyDSpaceNewSubmissionComponent as BaseComponent } from '../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission.component';
import { ThemedMyDSpaceNewSubmissionDropdownComponent } from '../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission-dropdown/themed-my-dspace-new-submission-dropdown.component';
import { ThemedUploaderComponent } from '../../../../../app/shared/upload/uploader/themed-uploader.component';

@Component({
  selector: 'ds-themed-my-dspace-new-submission',
  // styleUrls: ['./my-dspace-new-submission.component.scss'],
  styleUrls: ['../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission.component.scss'],
  // templateUrl: './my-dspace-new-submission.component.html',
  templateUrl: '../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission.component.html',
  standalone: true,
  imports: [
    ThemedMyDSpaceNewExternalDropdownComponent,
    ThemedMyDSpaceNewSubmissionDropdownComponent,
    ThemedUploaderComponent,
  ],
})
export class MyDSpaceNewSubmissionComponent extends BaseComponent {
}
