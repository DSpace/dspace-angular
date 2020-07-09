import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DsoPageAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/dso-page-administrator.guard';
import { Collection } from '../core/shared/collection.model';
import { CollectionPageResolver } from './collection-page.resolver';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard for preventing unauthorized access to certain {@link Collection} pages requiring administrator rights
 */
export class CollectionPageAdministratorGuard extends DsoPageAdministratorGuard<Collection> {
  constructor(protected resolver: CollectionPageResolver,
              protected authorizationService: AuthorizationDataService,
              protected router: Router) {
    super(resolver, authorizationService, router);
  }
}
