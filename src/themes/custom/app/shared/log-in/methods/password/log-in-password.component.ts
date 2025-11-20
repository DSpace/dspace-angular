import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { fadeOut } from '../../../../../../../app/shared/animations/fade';
import { BtnDisabledDirective } from '../../../../../../../app/shared/btn-disabled.directive';
import { LogInPasswordComponent as BaseComponent } from '../../../../../../../app/shared/log-in/methods/password/log-in-password.component';
import { BrowserOnlyPipe } from '../../../../../../../app/shared/utils/browser-only.pipe';

/**
 * /users/sign-in
 * @class LogInPasswordComponent
 */
@Component({
  selector: 'ds-themed-log-in-password',
  // templateUrl: './log-in-password.component.html',
  templateUrl: '../../../../../../../app/shared/log-in/methods/password/log-in-password.component.html',
  // styleUrls: ['./log-in-password.component.scss'],
  styleUrls: ['../../../../../../../app/shared/log-in/methods/password/log-in-password.component.scss'],
  animations: [fadeOut],
  standalone: true,
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    BtnDisabledDirective,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class LogInPasswordComponent extends BaseComponent {

}
