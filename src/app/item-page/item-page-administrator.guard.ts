import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { ItemPageResolver } from './item-page.resolver';
import {
  dsoPageSingleFeatureGuard
} from '../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring administrator rights
 */
export const itemPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => {
      const itemPageResolver = inject(ItemPageResolver);
      return itemPageResolver.resolve as ResolveFn<Observable<RemoteData<Item>>>;
    },
    () => observableOf(FeatureID.AdministratorOf)
  );
