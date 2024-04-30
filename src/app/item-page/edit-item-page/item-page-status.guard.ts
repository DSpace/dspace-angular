import {
  dsoPageSomeFeatureGuard
} from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-some-feature.guard';
import { CanActivateFn, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ItemPageResolver } from '../item-page.resolver';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring any of the rights required for
 * the status page
 * Check authorization rights
 */
export const itemPageStatusGuard: CanActivateFn =
  dsoPageSomeFeatureGuard(
    () => {
      const itemPageResolver = inject(ItemPageResolver);
      return itemPageResolver.resolve as ResolveFn<Observable<RemoteData<Item>>>;
    },
    () => observableOf([FeatureID.CanManageMappings, FeatureID.WithdrawItem, FeatureID.ReinstateItem, FeatureID.CanManagePolicies, FeatureID.CanMakePrivate, FeatureID.CanDelete, FeatureID.CanMove, FeatureID.CanRegisterDOI])
  );
