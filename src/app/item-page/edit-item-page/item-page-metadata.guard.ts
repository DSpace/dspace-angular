import { inject } from '@angular/core';
import {
  dsoPageSingleFeatureGuard
} from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { Item } from '../../core/shared/item.model';
import { ItemPageResolver } from '../item-page.resolver';
import { CanActivateFn, ResolveFn } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { RemoteData } from '../../core/data/remote-data';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring edit metadata rights
 * Check edit metadata authorization rights
 */
export const itemPageMetadataGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => {
      const itemPageResolver = inject(ItemPageResolver);
      return itemPageResolver.resolve as ResolveFn<Observable<RemoteData<Item>>>;
    },
    () => observableOf(FeatureID.CanEditMetadata)
  );
