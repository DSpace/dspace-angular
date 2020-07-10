import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { RemoteData } from '../../remote-data';
import { AuthorizationDataService } from '../authorization-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { getAllSucceededRemoteDataPayload } from '../../../shared/operators';
import { map } from 'rxjs/operators';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { FeatureAuthorizationGuard } from './feature-authorization.guard';

/**
 * Abstract Guard for preventing unauthorized access to {@link DSpaceObject} pages that require rights for a specific feature
 * This guard utilizes a resolver to retrieve the relevant object to check authorizations for
 */
export abstract class DsoPageFeatureGuard<T extends DSpaceObject> extends FeatureAuthorizationGuard {
  constructor(protected resolver: Resolve<RemoteData<T>>,
              protected authorizationService: AuthorizationDataService,
              protected router: Router) {
    super(authorizationService, router);
  }

  /**
   * Check authorization rights for the object resolved using the provided resolver
   */
  getObjectUrl(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    return (this.resolver.resolve(route, state) as Observable<RemoteData<T>>).pipe(
      getAllSucceededRemoteDataPayload(),
      map((dso) => dso.self)
    );
  }
}
