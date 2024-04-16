import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { DsoPageSingleFeatureGuard } from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { itemPageResolver } from '../item-page.resolver';

@Injectable({
  providedIn: 'root',
})
/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring DOI registration rights
 */
export class ItemPageRegisterDoiGuard extends DsoPageSingleFeatureGuard<Item> {

  protected resolver: ResolveFn<RemoteData<Item>> = itemPageResolver;

  constructor(protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected authService: AuthService) {
    super(authorizationService, router, authService);
  }

  /**
   * Check DOI registration authorization rights
   */
  getFeatureID(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.CanRegisterDOI);
  }
}
