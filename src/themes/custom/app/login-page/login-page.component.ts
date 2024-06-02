import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedLogInComponent } from 'src/app/shared/log-in/themed-log-in.component';

import { LoginPageComponent as BaseComponent } from '../../../../app/login-page/login-page.component';

/**
 * This component represents the login page
 */
@Component({
  selector: 'ds-themed-login-page',
  // styleUrls: ['./login-page.component.scss'],
  styleUrls: ['../../../../app/login-page/login-page.component.scss'],
  // templateUrl: './login-page.component.html'
  templateUrl: '../../../../app/login-page/login-page.component.html',
  standalone: true,
  imports: [ThemedLogInComponent, TranslateModule],
})
export class LoginPageComponent extends BaseComponent {
}
