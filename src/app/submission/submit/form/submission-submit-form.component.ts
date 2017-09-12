import { Component, ContentChildren, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BoxHostDirective } from './box/box-host.directive';

@Component({
  selector: 'ds-submission-submit-form',
  styleUrls: ['./submission-submit-form.component.scss'],
  templateUrl: './submission-submit-form.component.html'
})

export class SubmissionSubmitFormComponent {

  @ViewChild(BoxHostDirective) public boxHost: BoxHostDirective;

}
