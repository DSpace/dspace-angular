import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ItemDataService } from '../data/item-data.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { map } from 'rxjs/operators';
import { DSONameService } from './dso-name.service';
import { TranslateService } from '@ngx-translate/core';



/**
 * Service to calculate Publication claims breadcrumbs
 */
@Injectable({
  providedIn: 'root'
})
export class PublicationClaimBreadcrumbService implements BreadcrumbsProviderService<string> {
  private ADMIN_PUBLICATION_CLAIMS_PATH = 'admin/notifications/publication-claim';
  private ADMIN_PUBLICATION_CLAIMS_BREADCRUMB_KEY = 'admin.notifications.publicationclaim.page.title';

  constructor(private dataService: ItemDataService,
              private dsoNameService: DSONameService,
              private tranlsateService: TranslateService) {
  }


  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   */
  getBreadcrumbs(key: string): Observable<Breadcrumb[]> {
    return this.dataService.findById(key).pipe(
      getFirstCompletedRemoteData(),
      map((item) => {
        return [new Breadcrumb(this.tranlsateService.instant(this.ADMIN_PUBLICATION_CLAIMS_BREADCRUMB_KEY), this.ADMIN_PUBLICATION_CLAIMS_PATH),
          new Breadcrumb(this.dsoNameService.getName(item.payload), undefined)];
      })
    );
  }
}
