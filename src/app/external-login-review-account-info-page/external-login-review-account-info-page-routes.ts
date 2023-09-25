import { ExternalLoginReviewAccountInfoPageComponent } from './external-login-review-account-info-page.component';
import { ReviewAccountGuard } from './helpers/review-account.guard';
import { RegistrationDataResolver } from '../external-log-in/resolvers/registration-data.resolver';
import { Route } from '@angular/router';

export const ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: ExternalLoginReviewAccountInfoPageComponent,
    canActivate: [ReviewAccountGuard],
    resolve: { registrationData: RegistrationDataResolver },
  },
]
