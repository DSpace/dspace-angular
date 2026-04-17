import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { SourcesBreadcrumbService } from './sources-breadcrumb.service';

export const sourcesBreadcrumbResolver: ResolveFn<BreadcrumbConfig<string>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  breadcrumbService: SourcesBreadcrumbService = inject(SourcesBreadcrumbService),
): BreadcrumbConfig<string> => {
  const breadcrumbKey = route.data.breadcrumbKey;
  const sourceId = route.paramMap.get('sourceId');
  const topicId = route.paramMap.get('topicId');
  let key = `${breadcrumbKey}:${sourceId}`;

  if (topicId) {
    key += `:${topicId}`;
  }
  const fullPath = state.url;
  const url = fullPath.substring(0, fullPath.indexOf(sourceId));

  return { provider: breadcrumbService, key, url };
};
