import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { PublicationClaimBreadcrumbService } from './publication-claim-breadcrumb.service';

export const publicationClaimBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: PublicationClaimBreadcrumbService = inject(PublicationClaimBreadcrumbService),
): BreadcrumbConfig<string> => {
  const targetId = route.paramMap.get('targetId').split(':')[1];
  return { provider: breadcrumbService, key: targetId };
};
