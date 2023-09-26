import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'ds-email-validated',
  templateUrl: './email-validated.component.html',
  styleUrls: ['./email-validated.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailValidatedComponent {
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
