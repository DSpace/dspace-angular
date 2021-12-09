import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { Injectable } from '@angular/core';

/**
 * An abstract guard for redirecting users to the user agreement page if a certain condition is met
 * That condition is defined by abstract method hasAccepted
 */
@Injectable()
export abstract class FeedbackGuard implements CanActivate {

    constructor(protected router: Router, private authorizationService: AuthorizationDataService) {
    }

    /**
     * True when the user agreement has been accepted
     * The user will be redirected to the End User Agreement page if they haven't accepted it before
     * A redirect URL will be provided with the navigation so the component can redirect the user back to the blocked route
     * when they're finished accepting the agreement
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.authorizationService.isAuthorized(FeatureID.CanSendFeedback);
    }

}
