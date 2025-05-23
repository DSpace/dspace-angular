import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DSpaceObject } from '../../../shared/dspace-object.model';
import { RemoteData } from '../../remote-data';
import { FeatureID } from '../feature-id';
import { dsoPageSomeFeatureGuard } from './dso-page-some-feature.guard';
import { SingleFeatureGuardParamFn } from './single-feature-authorization.guard';

/**
 * Abstract Guard for preventing unauthorized access to {@link DSpaceObject} pages that require rights for a specific feature
 * This guard utilizes a resolver to retrieve the relevant object to check authorizations for
 */
export const dsoPageSingleFeatureGuard = <T extends DSpaceObject> (
  getResolveFn: () => ResolveFn<RemoteData<T>>,
  getFeatureID: SingleFeatureGuardParamFn,
): CanActivateFn => dsoPageSomeFeatureGuard(
    getResolveFn,
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID[]> => getFeatureID(route, state).pipe(
      map((featureID: FeatureID) => [featureID]),
    ));
