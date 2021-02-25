import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';

/**
 * Guard for preventing unauthorized access to /access-control/groups/*
 */
@Injectable({
  providedIn: 'root'
})
export class CanManageGroupGuard implements CanActivate {
  constructor(private authorizationService: AuthorizationDataService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    return this.authorizationService.isAuthorized(FeatureID.CanManageGroups);
  }
}
