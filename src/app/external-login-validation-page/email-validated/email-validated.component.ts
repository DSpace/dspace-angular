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
    // if user is logged in, redirect to home page
    // in case user logs in with an existing account
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }
}
