import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
@Component({
  selector: 'ds-email-validated',
  templateUrl: './email-validated.component.html',
  styleUrls: ['./email-validated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailValidatedComponent {

  constructor(private authService: AuthService) {
    // After the user has validated his email, we need to redirect him to the review account page,
    // in order to review his account information
    this.authService.setRedirectUrl('/review-account');
  }
}
