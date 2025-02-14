import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { QualityAssuranceBreadcrumbService } from './quality-assurance-breadcrumb.service';

export const qualityAssuranceBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: QualityAssuranceBreadcrumbService = inject(QualityAssuranceBreadcrumbService),
): BreadcrumbConfig<string> => {
  const sourceId = route.paramMap.get('sourceId');
  const topicId = route.paramMap.get('topicId');
  let key = sourceId;

  if (topicId) {
    key += `:${topicId}`;
  }
  const fullPath = state.url;
  const url = fullPath.substring(0, fullPath.indexOf(sourceId));

  return { provider: breadcrumbService, key, url };
};
