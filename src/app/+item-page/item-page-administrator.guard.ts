import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { ItemPageResolver } from './item-page.resolver';
import { Item } from '../core/shared/item.model';
import { DsoPageFeatureGuard } from '../core/data/feature-authorization/feature-authorization-guard/dso-page-feature.guard';
import { Observable } from 'rxjs/internal/Observable';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { of as observableOf } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring administrator rights
 */
export class ItemPageAdministratorGuard extends DsoPageFeatureGuard<Item> {
  constructor(protected resolver: ItemPageResolver,
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
