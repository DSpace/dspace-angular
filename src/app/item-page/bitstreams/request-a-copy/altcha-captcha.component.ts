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
    TranslateModule,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    NgIf,
    VarDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class AltchaCaptchaComponent implements OnInit {

  @Input() challengeUrl: string;
  @Input() autoload: string;
  @Input() debug: boolean;
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
