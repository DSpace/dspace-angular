import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { PublicationClaimBreadcrumbService } from './publication-claim-breadcrumb.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationClaimBreadcrumbResolver implements Resolve<BreadcrumbConfig<string>>  {
  constructor(protected breadcrumbService: PublicationClaimBreadcrumbService) {
  }

  /**
   * Method that resolve Publication Claim item into a breadcrumb
   * The parameter are retrieved by the url since part of the Publication Claim route config
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    const targetId = route.paramMap.get('targetId').split(':')[1];
    return { provider: this.breadcrumbService, key: targetId };
  }
}
