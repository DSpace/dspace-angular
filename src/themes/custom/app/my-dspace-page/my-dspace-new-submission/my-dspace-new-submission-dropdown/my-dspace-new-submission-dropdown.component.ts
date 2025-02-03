import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { MyDSpaceNewSubmissionDropdownComponent as BaseComponent } from '../../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component';
import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { EntityDropdownComponent } from '../../../../../../app/shared/entity-dropdown/entity-dropdown.component';
import { BrowserOnlyPipe } from '../../../../../../app/shared/utils/browser-only.pipe';


@Component({
  selector: 'ds-themed-my-dspace-new-submission-dropdown',
  styleUrls: ['../../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component.scss'],
  standalone: true,
  // templateUrl: './my-dspace-new-submission-dropdown.component.html'
  templateUrl: '../../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-submission-dropdown/my-dspace-new-submission-dropdown.component.html',
  imports: [
    EntityDropdownComponent,
    NgbDropdownModule,
    AsyncPipe,
    TranslateModule,
    BrowserOnlyPipe,
    NgIf,
    BtnDisabledDirective,
  ],
})
export class MyDSpaceNewSubmissionDropdownComponent extends  BaseComponent{

}
