import { Component } from '@angular/core';
import { ThemedRegisterEmailFormComponent } from 'src/app/register-email-form/themed-registry-email-form.component';

import { TYPE_REQUEST_REGISTER } from '../../register-email-form/register-email-form.component';

@Component({
  selector: 'ds-base-register-email',
  styleUrls: ['./register-email.component.scss'],
  templateUrl: './register-email.component.html',
  imports: [
    ThemedRegisterEmailFormComponent,
  ],
  standalone: true,
})
/**
 * Component responsible the email registration step when registering as a new user
 */
export class RegisterEmailComponent {
  typeRequest = TYPE_REQUEST_REGISTER;
}
