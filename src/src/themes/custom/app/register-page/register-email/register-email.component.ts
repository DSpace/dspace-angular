import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedRegisterEmailFormComponent } from 'src/app/register-email-form/themed-registry-email-form.component';

import { RegisterEmailComponent as BaseComponent } from '../../../../../app/register-page/register-email/register-email.component';

@Component({
  selector: 'ds-themed-register-email',
  styleUrls: ['../../../../../app/register-page/register-email/register-email.component.scss'],
  templateUrl: './register-email.component.html',
  imports: [
    ThemedRegisterEmailFormComponent,
    TranslateModule,
  ],
})
export class RegisterEmailComponent extends BaseComponent {
}
