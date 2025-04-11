import {
  AsyncPipe,
  NgClass,
  NgComponentOutlet,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AlertComponent } from '../../../../../../app/shared/alert/alert.component';
import { SubmissionSectionContainerComponent as BaseComponent } from '../../../../../../app/submission/sections/container/section-container.component';
import { SectionsDirective } from '../../../../../../app/submission/sections/sections.directive';

@Component({
  selector: 'ds-themed-submission-upload-section-file',
  // styleUrls: ['./section-container.component.scss'],
  styleUrls: ['../../../../../../app/submission/sections/container/section-container.component.scss'],
  // templateUrl: './section-container.component.html'
  templateUrl: '../../../../../../app/submission/sections/container/section-container.component.html',
  standalone: true,
  imports: [
    AlertComponent,
    NgbAccordionModule,
    NgComponentOutlet,
    TranslateModule,
    NgClass,
    AsyncPipe,
    SectionsDirective,
  ],
})
export class SubmissionSectionContainerComponent extends BaseComponent {

}
