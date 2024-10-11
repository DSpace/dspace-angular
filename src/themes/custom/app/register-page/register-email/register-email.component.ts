import { Component } from '@angular/core';
import { ThemedRegisterEmailFormComponent } from 'src/app/register-email-form/themed-registry-email-form.component';

import { RegisterEmailComponent as BaseComponent } from '../../../../../app/register-page/register-email/register-email.component';

@Component({
  selector: 'ds-themed-register-email',
  // styleUrls: ['./register-email.component.scss'],
  styleUrls: ['../../../../../app/register-page/register-email/register-email.component.scss'],
  // templateUrl: './register-email.component.html'
  templateUrl: '../../../../../app/register-page/register-email/register-email.component.html',
  standalone: true,
  imports: [
    ThemedRegisterEmailFormComponent,
  ],
})
export class RegisterEmailComponent extends BaseComponent {
}
