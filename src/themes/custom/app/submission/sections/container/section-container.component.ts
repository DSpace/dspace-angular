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
  selector: 'ds-themed-base-submission-section-container',
  // styleUrls: ['./section-container.component.scss'],
  styleUrls: ['../../../../../../app/submission/sections/container/section-container.component.scss'],
  // templateUrl: './section-container.component.html'
  templateUrl: '../../../../../../app/submission/sections/container/section-container.component.html',
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    NgbAccordionModule,
    NgClass,
    NgComponentOutlet,
    SectionsDirective,
    TranslateModule,
  ],
})
export class SubmissionSectionContainerComponent extends BaseComponent {

}
