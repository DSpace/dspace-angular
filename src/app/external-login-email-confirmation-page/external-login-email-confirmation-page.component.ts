import { Component } from '@angular/core';

import { ConfirmationSentComponent } from '../external-log-in/email-confirmation/confirmation-sent/confirmation-sent.component';

@Component({
  templateUrl: './external-login-email-confirmation-page.component.html',
  styleUrls: ['./external-login-email-confirmation-page.component.scss'],
  standalone: true,
  imports: [
    ConfirmationSentComponent,
  ],
})
export class ExternalLoginEmailConfirmationPageComponent {
}
