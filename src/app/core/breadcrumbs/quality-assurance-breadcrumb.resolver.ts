import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { QualityAssuranceBreadcrumbService } from './quality-assurance-breadcrumb.service';

@Injectable({
  providedIn: 'root',
})
export class QualityAssuranceBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>>  {
  constructor(protected breadcrumbService: QualityAssuranceBreadcrumbService) {}

  /**
   * Method that resolve QA item into a breadcrumb
   * The parameter are retrieved by the url since part of the QA route config
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    const sourceId = route.paramMap.get('sourceId');
    const topicId = route.paramMap.get('topicId');
    let key = sourceId;

    if (topicId) {
      key += `:${topicId}`;
    }
    const fullPath = state.url;
    const url = fullPath.substr(0, fullPath.indexOf(sourceId));

    return { provider: this.breadcrumbService, key, url };
  }
}
