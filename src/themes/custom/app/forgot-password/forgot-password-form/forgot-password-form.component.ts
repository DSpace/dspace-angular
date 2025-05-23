import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ForgotPasswordFormComponent as BaseComponent } from '../../../../../app/forgot-password/forgot-password-form/forgot-password-form.component';
import { ProfilePageSecurityFormComponent } from '../../../../../app/profile-page/profile-page-security-form/profile-page-security-form.component';
import { BtnDisabledDirective } from '../../../../../app/shared/btn-disabled.directive';
import { BrowserOnlyPipe } from '../../../../../app/shared/utils/browser-only.pipe';

@Component({
  selector: 'ds-themed-forgot-password-form',
  // styleUrls: ['./forgot-password-form.component.scss'],
  styleUrls: ['../../../../../app/forgot-password/forgot-password-form/forgot-password-form.component.scss'],
  // templateUrl: './forgot-password-form.component.html'
  templateUrl: '../../../../../app/forgot-password/forgot-password-form/forgot-password-form.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    BrowserOnlyPipe,
    BtnDisabledDirective,
    ProfilePageSecurityFormComponent,
    TranslateModule,
  ],
})
export class ForgotPasswordFormComponent extends BaseComponent {
}
