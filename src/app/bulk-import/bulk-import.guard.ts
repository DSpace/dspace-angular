import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { flatMap, take } from 'rxjs/operators';

import { CollectionDataService } from '../core/data/collection-data.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { Collection } from '../core/shared/collection.model';
import {
  getFirstCompletedRemoteData,
  redirectOn4xx,
  returnForbiddenUrlTreeOrLoginOnFalse
} from '../core/shared/operators';
import { AuthService } from '../core/auth/auth.service';

/**
 * A guard taking care of the correct route.data being set for the BulkImport components
 */
@Injectable()
export class BulkImportGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private authorizationService: AuthorizationDataService,
    private collectionService: CollectionDataService,
    private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.collectionService.findById(route.params.id).pipe(
      getFirstCompletedRemoteData(),
      redirectOn4xx(this.router, this.authService),
      flatMap((RD) => this.isCollectionAdmin(RD.payload)),
      returnForbiddenUrlTreeOrLoginOnFalse(this.router, this.authService, state.url)
    );
  }

  isCollectionAdmin(collection: Collection): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, collection.self, undefined);
  }

}
