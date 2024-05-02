import { DSpaceObject } from '../../../shared/dspace-object.model';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../../remote-data';
import { hasValue, hasNoValue } from '../../../../shared/empty.util';
import { getAllSucceededRemoteDataPayload } from '../../../shared/operators';
import { map } from 'rxjs/operators';
import {
  StringGuardParamFn,
  SomeFeatureGuardParamFn,
  someFeatureAuthorizationGuard
} from './some-feature-authorization.guard';
import { FeatureID } from '../feature-id';

export declare type DSOGetObjectURlFn = <T extends DSpaceObject>(resolve: ResolveFn<Observable<RemoteData<T>>>) => StringGuardParamFn;


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



export const defaultDSOGetObjectUrl: DSOGetObjectURlFn = <T extends DSpaceObject>(resolve: ResolveFn<Observable<RemoteData<T>>>): StringGuardParamFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> => {
    const routeWithObjectID = getRouteWithDSOId(route);
    return (resolve(routeWithObjectID, state) as Observable<RemoteData<T>>).pipe(
      getAllSucceededRemoteDataPayload(),
      map((dso) => dso.self)
    );
  };
};

/**
 * Guard for preventing unauthorized access to {@link DSpaceObject} pages that require rights for any specific feature in a list
 * This guard utilizes a resolver to retrieve the relevant object to check authorizations for
 */
export const dsoPageSomeFeatureGuard = <T extends DSpaceObject>(
  getResolveFn: () => ResolveFn<Observable<RemoteData<T>>>,
  getFeatureIDs: SomeFeatureGuardParamFn,
  getObjectUrl: DSOGetObjectURlFn = defaultDSOGetObjectUrl,
  getEPersonUuid?: StringGuardParamFn,
): CanActivateFn => someFeatureAuthorizationGuard((route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID[]> => getFeatureIDs(route, state), getObjectUrl(getResolveFn()), getEPersonUuid);
