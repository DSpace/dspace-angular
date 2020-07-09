import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DsoPageAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/dso-page-administrator.guard';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { ItemPageResolver } from './item-page.resolver';
import { Item } from '../core/shared/item.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring administrator rights
 */
export class ItemPageAdministratorGuard extends DsoPageAdministratorGuard<Item> {
  constructor(protected resolver: ItemPageResolver,
              protected authorizationService: AuthorizationDataService,
              protected router: Router) {
    super(resolver, authorizationService, router);
  }
}
