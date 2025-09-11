import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring manage relationships rights
 * Check manage relationships authorization rights
 */
export const itemPageRelationshipsGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => of(FeatureID.CanManageRelationships),
  );
