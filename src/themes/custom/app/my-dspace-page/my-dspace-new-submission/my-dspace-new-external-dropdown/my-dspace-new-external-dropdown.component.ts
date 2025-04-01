import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { MyDSpaceNewExternalDropdownComponent as BaseComponent } from '../../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component';
import { BtnDisabledDirective } from '../../../../../../app/shared/btn-disabled.directive';
import { EntityDropdownComponent } from '../../../../../../app/shared/entity-dropdown/entity-dropdown.component';
import { BrowserOnlyPipe } from '../../../../../../app/shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-themed-my-dspace-new-external-dropdown',
  // styleUrls: ['./my-dspace-new-external-dropdown.component.scss'],
  styleUrls: ['../../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component.scss'],
  // templateUrl: './my-dspace-new-external-dropdown.component.html'
  templateUrl: '../../../../../../app/my-dspace-page/my-dspace-new-submission/my-dspace-new-external-dropdown/my-dspace-new-external-dropdown.component.html',
  standalone: true,
  imports: [
    EntityDropdownComponent,
    NgbDropdownModule,
    AsyncPipe,
    TranslateModule,
    BrowserOnlyPipe,
    BtnDisabledDirective,
  ],
})
export class MyDSpaceNewExternalDropdownComponent extends BaseComponent {
}
