import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DsoPageAdministratorGuard } from '../core/data/feature-authorization/feature-authorization-guard/dso-page-administrator.guard';
import { Community } from '../core/shared/community.model';
import { CommunityPageResolver } from './community-page.resolver';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard for preventing unauthorized access to certain {@link Community} pages requiring administrator rights
 */
export class CommunityPageAdministratorGuard extends DsoPageAdministratorGuard<Community> {
  constructor(protected resolver: CommunityPageResolver,
              protected authorizationService: AuthorizationDataService,
              protected router: Router) {
    super(resolver, authorizationService, router);
  }
}
