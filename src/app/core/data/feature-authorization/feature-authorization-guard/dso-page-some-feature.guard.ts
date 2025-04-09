import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  hasNoValue,
  hasValue,
} from '../../../../shared/empty.util';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { getAllSucceededRemoteDataPayload } from '../../../shared/operators';
import { RemoteData } from '../../remote-data';
import { FeatureID } from '../feature-id';
import {
  someFeatureAuthorizationGuard,
  SomeFeatureGuardParamFn,
  StringGuardParamFn,
} from './some-feature-authorization.guard';

export declare type DSOGetObjectURlFn = <T extends DSpaceObject>(resolve: ResolveFn<RemoteData<T>>) => StringGuardParamFn;


/**
 * Method to resolve resolve (parent) route that contains the UUID of the DSO
 * @param route The current route
 */
export const getRouteWithDSOId = (route: ActivatedRouteSnapshot): ActivatedRouteSnapshot => {
  let routeWithDSOId = route;
  while (hasNoValue(routeWithDSOId.params.id) && hasValue(routeWithDSOId.parent)) {
    routeWithDSOId = routeWithDSOId.parent;
  }
  return routeWithDSOId;
};



export const defaultDSOGetObjectUrl: DSOGetObjectURlFn = <T extends DSpaceObject>(resolve: ResolveFn<RemoteData<T>>): StringGuardParamFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> => {
    const routeWithObjectID = getRouteWithDSOId(route);
    return (resolve(routeWithObjectID, state) as Observable<RemoteData<T>>).pipe(
      getAllSucceededRemoteDataPayload(),
      map((dso) => dso.self),
    );
  };
};

/**
 * Guard for preventing unauthorized access to {@link DSpaceObject} pages that require rights for any specific feature in a list
 * This guard utilizes a resolver to retrieve the relevant object to check authorizations for
 */
export const dsoPageSomeFeatureGuard = <T extends DSpaceObject>(
  getResolveFn: () => ResolveFn<RemoteData<T>>,
  getFeatureIDs: SomeFeatureGuardParamFn,
  getObjectUrl: DSOGetObjectURlFn = defaultDSOGetObjectUrl,
  getEPersonUuid?: StringGuardParamFn,
): CanActivateFn => someFeatureAuthorizationGuard((route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID[]> => getFeatureIDs(route, state), getObjectUrl(getResolveFn()), getEPersonUuid);
