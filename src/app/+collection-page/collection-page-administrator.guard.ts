import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Collection } from '../core/shared/collection.model';
import { CollectionPageResolver } from './collection-page.resolver';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { of as observableOf } from 'rxjs';
import { DsoPageFeatureGuard } from '../core/data/feature-authorization/feature-authorization-guard/dso-page-feature.guard';
import { Observable } from 'rxjs/internal/Observable';
import { FeatureID } from '../core/data/feature-authorization/feature-id';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard for preventing unauthorized access to certain {@link Collection} pages requiring administrator rights
 */
export class CollectionPageAdministratorGuard extends DsoPageFeatureGuard<Collection> {
  constructor(protected resolver: CollectionPageResolver,
              protected authorizationService: AuthorizationDataService,
              protected router: Router) {
    super(resolver, authorizationService, router);
  }

  /**
   * Check administrator authorization rights
   */
  getFeatureID(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.AdministratorOf);
  }
}
