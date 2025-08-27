import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { VarDirective } from '../../../shared/utils/var.directive';

@Component({
  selector: 'ds-altcha-captcha',
  templateUrl: './altcha-captcha.component.html',
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})

/**
 * Component that renders the ALTCHA captcha widget. GDPR-compliant, no cookies, proof-of-work based anti-spam captcha.
 * See: https://altcha.org/
 *
 * Once the proof of work is verified, the final payload is emitted to the parent component for inclusion in the form submission.
 */
export class AltchaCaptchaComponent implements OnInit {

  // Challenge URL, to query the backend (or other remote) for a challenge
  @Input() challengeUrl: string;
  // Whether / how to autoload the widget, e.g. 'onload', 'onsubmit', 'onfocus', 'off'
  @Input() autoload = 'onload';
  // Whether to debug altcha activity to the javascript console
  @Input() debug: boolean;
  // The final calculated payload (containing, challenge, salt, number) to be sent with the protected form submission for validation
  @Output() payload = new EventEmitter<string>;

  ngOnInit(): void {
    document.querySelector('#altcha-widget').addEventListener('statechange', (ev: any) => {
      // state can be: unverified, verifying, verified, error
      if (ev.detail.state === 'verified') {
        // payload contains base64 encoded data for the server
        this.payload.emit(ev.detail.payload);
      }
    });
  }

}
