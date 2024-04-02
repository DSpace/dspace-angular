import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  hasNoValue,
  hasValue,
} from '../../../../shared/empty.util';
import { AuthService } from '../../../auth/auth.service';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { getAllSucceededRemoteDataPayload } from '../../../shared/operators';
import { RemoteData } from '../../remote-data';
import { AuthorizationDataService } from '../authorization-data.service';
import { SomeFeatureAuthorizationGuard } from './some-feature-authorization.guard';

/**
 * Abstract Guard for preventing unauthorized access to {@link DSpaceObject} pages that require rights for any specific feature in a list
 * This guard utilizes a resolver to retrieve the relevant object to check authorizations for
 */
export abstract class DsoPageSomeFeatureGuard<T extends DSpaceObject> extends SomeFeatureAuthorizationGuard {

  protected abstract resolver: ResolveFn<RemoteData<DSpaceObject>>;

  constructor(protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected authService: AuthService) {
    super(authorizationService, router, authService);
  }

  /**
   * Check authorization rights for the object resolved using the provided resolver
   */
  getObjectUrl(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    const routeWithObjectID = this.getRouteWithDSOId(route);
    return (this.resolver(routeWithObjectID, state) as Observable<RemoteData<T>>).pipe(
      getAllSucceededRemoteDataPayload(),
      map((dso) => dso.self),
    );
  }

  /**
   * Method to resolve (parent) route that contains the UUID of the DSO
   * @param route The current route
   */
  protected getRouteWithDSOId(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let routeWithDSOId = route;
    while (hasNoValue(routeWithDSOId.params.id) && hasValue(routeWithDSOId.parent)) {
      routeWithDSOId = routeWithDSOId.parent;
    }
    return routeWithDSOId;
  }
}
