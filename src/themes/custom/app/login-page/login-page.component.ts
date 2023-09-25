import { Component } from '@angular/core';
import { LoginPageComponent as BaseComponent } from '../../../../app/login-page/login-page.component';
import { LogInComponent } from '../../../../app/shared/log-in/log-in.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component represents the login page
 */
@Component({
  selector: 'ds-login-page',
  // styleUrls: ['./login-page.component.scss'],
  styleUrls: ['../../../../app/login-page/login-page.component.scss'],
  // templateUrl: './login-page.component.html'
  templateUrl: '../../../../app/login-page/login-page.component.html',
  standalone: true,
  imports: [LogInComponent, TranslateModule]
})
export class LoginPageComponent extends BaseComponent {
}
