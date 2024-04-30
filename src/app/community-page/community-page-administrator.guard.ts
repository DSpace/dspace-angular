import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import {
  dsoPageSingleFeatureGuard
} from '../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { CommunityPageResolver } from './community-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Community} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const communityPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => {
      const communityPageResolver = inject(CommunityPageResolver);
      return communityPageResolver.resolve as ResolveFn<Observable<RemoteData<Community>>>;
    },
    () => observableOf(FeatureID.AdministratorOf)
  );
