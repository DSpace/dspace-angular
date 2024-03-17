import { Component } from '@angular/core';
import { ThemedRegisterEmailFormComponent } from 'src/app/register-email-form/themed-registry-email-form.component';

import { ForgotEmailComponent as BaseComponent } from '../../../../../app/forgot-password/forgot-password-email/forgot-email.component';
import { RegisterEmailFormComponent } from '../../../../../app/register-email-form/register-email-form.component';

@Component({
  selector: 'ds-forgot-email',
  // styleUrls: ['./forgot-email.component.scss'],
  styleUrls: ['../../../../../app/forgot-password/forgot-password-email/forgot-email.component.scss'],
  // templateUrl: './forgot-email.component.html'
  templateUrl: '../../../../../app/forgot-password/forgot-password-email/forgot-email.component.html',
  standalone: true,
  imports: [
    RegisterEmailFormComponent,
    ThemedRegisterEmailFormComponent,
  ],
})
/**
 * Component responsible the forgot password email step
 */
export class ForgotEmailComponent extends BaseComponent {
}
