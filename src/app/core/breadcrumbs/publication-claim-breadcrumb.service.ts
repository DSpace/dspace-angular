import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../data/feature-authorization/feature-id';
import { ItemDataService } from '../data/item-data.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { DSONameService } from './dso-name.service';

/**
 * Service to calculate Publication claims breadcrumbs
 */
@Injectable({
  providedIn: 'root',
})
export class PublicationClaimBreadcrumbService implements BreadcrumbsProviderService<string> {
  private ADMIN_PUBLICATION_CLAIMS_PATH = 'admin/notifications/publication-claim';
  private ADMIN_PUBLICATION_CLAIMS_BREADCRUMB_KEY = 'admin.notifications.publicationclaim.page.title';

  constructor(private dataService: ItemDataService,
              private dsoNameService: DSONameService,
              private tranlsateService: TranslateService,
              protected authorizationService: AuthorizationDataService) {
  }


  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   */
  getBreadcrumbs(key: string): Observable<Breadcrumb[]> {
    return combineLatest([this.dataService.findById(key).pipe(getFirstCompletedRemoteData()),this.authorizationService.isAuthorized(FeatureID.AdministratorOf)]).pipe(
      map(([item, isAdmin]) => {
        const itemName = this.dsoNameService.getName(item.payload);
        return isAdmin ? [new Breadcrumb(this.tranlsateService.instant(this.ADMIN_PUBLICATION_CLAIMS_BREADCRUMB_KEY), this.ADMIN_PUBLICATION_CLAIMS_PATH),
          new Breadcrumb(this.tranlsateService.instant('suggestion.suggestionFor.breadcrumb', { name: itemName }), undefined)] :
          [new Breadcrumb(this.tranlsateService.instant('suggestion.suggestionFor.breadcrumb', { name: itemName }), undefined)];
      }),
    );
  }
}
