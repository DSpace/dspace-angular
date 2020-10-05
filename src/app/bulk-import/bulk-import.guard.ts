import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { find, flatMap, take } from 'rxjs/operators';
import { CollectionDataService } from '../core/data/collection-data.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { Collection } from '../core/shared/collection.model';
import { redirectToPageNotFoundOn404, returnUnauthorizedUrlTreeOnFalse } from '../core/shared/operators';
import { hasValue } from '../shared/empty.util';

/**
 * A guard taking care of the correct route.data being set for the BulkImport components
 */
@Injectable()
export class BulkImportGuard implements CanActivate {

  constructor(
    private authorizationService: AuthorizationDataService,
    private collectionService: CollectionDataService,
    private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.collectionService.findById(route.params.id).pipe(
      find((RD) => hasValue(RD.error) || RD.hasSucceeded),
      redirectToPageNotFoundOn404(this.router),
      take(1),
      flatMap((RD) => this.isCollectionAdmin(RD.payload)),
      returnUnauthorizedUrlTreeOnFalse(this.router)
    );
  }

  isCollectionAdmin(collection: Collection): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, collection.self, undefined);
  }

}
