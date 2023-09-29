import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
@Component({
  selector: 'ds-email-validated',
  templateUrl: './email-validated.component.html',
  styleUrls: ['./email-validated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailValidatedComponent {

  // TODO: (temporary)
  // evaluate if this is needed
  @Input() registrationToken: string;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.setRedirectUrl('/review-account');
  }
}
