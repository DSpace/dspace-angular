import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../data/feature-authorization/feature-id';
import {
  SingleFeatureAuthorizationGuard
} from '../data/feature-authorization/feature-authorization-guard/single-feature-authorization.guard';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard that checks if the forgot-password feature is enabled
 */
export class ForgotPasswordCheckGuard extends SingleFeatureAuthorizationGuard {

  constructor(
    protected readonly authorizationService: AuthorizationDataService,
    protected readonly router: Router,
    protected readonly authService: AuthService
  ) {
    super(authorizationService, router, authService);
  }

  getFeatureID(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return of(FeatureID.EPersonForgotPassword);
  }

}
