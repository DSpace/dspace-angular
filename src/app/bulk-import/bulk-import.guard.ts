import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import { CollectionDataService } from '../core/data/collection-data.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import {
  redirectOn4xx,
  returnForbiddenUrlTreeOrLoginOnFalse,
} from '../core/shared/authorized.operators';
import { Collection } from '../core/shared/collection.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';

export const bulkImportGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const authorizationService = inject(AuthorizationDataService);
  const collectionService = inject(CollectionDataService);
  const router = inject(Router);

  const isCollectionAdmin = (collection: Collection): Observable<boolean> => {
    return authorizationService.isAuthorized(FeatureID.AdministratorOf, collection.self, undefined);
  };

  return collectionService.findById(route.params.id).pipe(
    getFirstCompletedRemoteData(),
    redirectOn4xx(router, authService),
    mergeMap((RD) => isCollectionAdmin(RD.payload)),
    returnForbiddenUrlTreeOrLoginOnFalse(router, authService, state.url),
  );
};
