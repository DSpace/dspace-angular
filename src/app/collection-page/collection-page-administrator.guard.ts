import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import {
  dsoPageSingleFeatureGuard
} from '../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';
import { CollectionPageResolver } from './collection-page.resolver';
import { Collection } from '../core/shared/collection.model';

/**
 * Guard for preventing unauthorized access to certain {@link Collection} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const collectionPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => {
      const collectionPageResolver = inject(CollectionPageResolver);
      return collectionPageResolver.resolve as ResolveFn<Observable<RemoteData<Collection>>>;
    },
    () => observableOf(FeatureID.AdministratorOf)
  );
