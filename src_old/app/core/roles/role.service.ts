import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

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
  constructor(private collectionService: CollectionDataService) {
  }

  /**
   * Check if current user is a submitter
   */
  isSubmitter(): Observable<boolean> {
    return this.collectionService.hasAuthorizedCollection().pipe(
      distinctUntilChanged(),
    );
  }

  /**
   * Check if current user is a controller
   */
  isController(): Observable<boolean> {
    // TODO find a way to check if user is a controller
    return of(true);
  }

  /**
   * Check if current user is an admin
   */
  isAdmin(): Observable<boolean> {
    // TODO find a way to check if user is an admin
    return of(false);
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
