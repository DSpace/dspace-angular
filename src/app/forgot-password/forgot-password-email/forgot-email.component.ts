import { Component } from '@angular/core';
import { ThemedRegisterEmailFormComponent } from 'src/app/register-email-form/themed-registry-email-form.component';

import {
  RegisterEmailFormComponent,
  TYPE_REQUEST_FORGOT,
} from '../../register-email-form/register-email-form.component';

@Component({
  selector: 'ds-forgot-email',
  styleUrls: ['./forgot-email.component.scss'],
  templateUrl: './forgot-email.component.html',
  imports: [
    RegisterEmailFormComponent, ThemedRegisterEmailFormComponent,
  ],
  standalone: true,
})
/**
 * Component responsible the forgot password email step
 */
export class ForgotEmailComponent {
  typeRequest = TYPE_REQUEST_FORGOT;
}
