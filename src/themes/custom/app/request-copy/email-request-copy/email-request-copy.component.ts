import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EmailRequestCopyComponent as BaseComponent } from 'src/app/request-copy/email-request-copy/email-request-copy.component';

import { BtnDisabledDirective } from '../../../../../app/shared/btn-disabled.directive';

@Component({
  selector: 'ds-themed-email-request-copy',
  // styleUrls: ['./email-request-copy.component.scss'],
  styleUrls: ['../../../../../app/request-copy/email-request-copy/email-request-copy.component.scss'],
  // templateUrl: './email-request-copy.component.html',
  templateUrl: '../../../../../app/request-copy/email-request-copy/email-request-copy.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    FormsModule,
    NgbDropdownModule,
    NgClass,
    TranslateModule,
  ],
})
export class EmailRequestCopyComponent extends BaseComponent {
}
