import { Injectable } from '@angular/core';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
} from 'rxjs/operators';

import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../data/feature-authorization/feature-id';
import { CollectionDataService } from '../data/collection-data.service';
import { RoleType } from './role-types';

/**
 * A service that provides methods to identify user role.
 */
@Injectable({ providedIn: 'root' })
export class RoleService {

  /**
   * Initialize instance variables
   *
   * @param {CollectionDataService} collectionService
   */
  constructor(
    private collectionService: CollectionDataService,
    private authorizationService: AuthorizationDataService,
  ) {
  }

  /**
   * Check if current user is a submitter
   */
  isSubmitter(): Observable<boolean> {
    return this.collectionService.hasAuthorizedCollection().pipe(distinctUntilChanged());
  }

  /**
   * Check if current user is a controller
   */
  isController(): Observable<boolean> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
    ]).pipe(
      map(([isCollectionAdmin, isCommunityAdmin]) => isCollectionAdmin || isCommunityAdmin),
      distinctUntilChanged(),
    );
  }

  /**
   * Check if current user is an admin
   */
  isAdmin(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      distinctUntilChanged(),
    );
  }

  /**
   * Check if current user by role type
   *
   * @param {RoleType} role
   *    the role type
   */
  checkRole(role: RoleType): Observable<boolean> {
    let check: Observable<boolean>;
    switch (role) {
      case RoleType.Submitter:
        check = this.isSubmitter();
        break;
      case RoleType.Controller:
        check = this.isController();
        break;
      case RoleType.Admin:
        check = this.isAdmin();
        break;
    }

    return check;
  }
}
