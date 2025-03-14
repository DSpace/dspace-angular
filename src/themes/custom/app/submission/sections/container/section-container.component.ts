import { Component } from '@angular/core';

import { SubmissionSectionContainerComponent as BaseComponent } from '../../../../../../app/submission/sections/container/section-container.component';

@Component({
  selector: 'ds-themed-submission-upload-section-file',
  // styleUrls: ['./section-container.component.scss'],
  styleUrls: ['../../../../../../app/submission/sections/container/section-container.component.scss'],
  // templateUrl: './section-container.component.html'
  templateUrl: '../../../../../../app/submission/sections/container/section-container.component.html',
  standalone: true,
})
export class SubmissionSectionContainerComponent extends BaseComponent {

}
