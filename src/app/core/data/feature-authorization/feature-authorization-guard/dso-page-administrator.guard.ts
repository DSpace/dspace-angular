import { FeatureAuthorizationGuard } from './feature-authorization.guard';
import { AuthorizationDataService } from '../authorization-data.service';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { FeatureID } from '../feature-id';
import { of as observableOf } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../remote-data';
import { getAllSucceededRemoteDataPayload } from '../../../shared/operators';
import { map } from 'rxjs/operators';

/**
 * Abstract Guard for preventing unauthorized access to {@link DSpaceObject} pages that require administrator rights
 * This guard utilizes a resolver to retrieve the relevant object to check authorizations for
 */
export abstract class DsoPageAdministratorGuard<T extends DSpaceObject> extends FeatureAuthorizationGuard {
  constructor(protected resolver: Resolve<RemoteData<T>>,
              protected authorizationService: AuthorizationDataService,
              protected router: Router) {
    super(authorizationService, router);
  }

  /**
   * Check administrator authorization rights
   */
  getFeatureID(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.AdministratorOf);
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
