import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedRegisterEmailFormComponent } from 'src/app/register-email-form/themed-registry-email-form.component';

import { ForgotEmailComponent as BaseComponent } from '../../../../../app/forgot-password/forgot-password-email/forgot-email.component';

@Component({
  selector: 'ds-themed-forgot-email',
  styleUrls: ['../../../../../app/forgot-password/forgot-password-email/forgot-email.component.scss'],
  templateUrl: './forgot-email.component.html',
  imports: [
    ThemedRegisterEmailFormComponent,
    TranslateModule,
  ],
})
export class ForgotEmailComponent extends BaseComponent {
}
