import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';

/**
 * Service to calculate QA breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root',
})
export class QualityAssuranceBreadcrumbService implements BreadcrumbsProviderService<string> {

  private QUALITY_ASSURANCE_BREADCRUMB_KEY = 'admin.quality-assurance.breadcrumbs';
  constructor(
    private translationService: TranslateService,
  ) {

  }


  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    const args = key.split(':');
    const sourceId = args[0];
    const topicId = args.length > 2 ? args[args.length - 1] : args[1];

    if (topicId) {
      return observableOf( [new Breadcrumb(this.translationService.instant(this.QUALITY_ASSURANCE_BREADCRUMB_KEY), url),
        new Breadcrumb(sourceId, `${url}${sourceId}`),
        new Breadcrumb(topicId, undefined)]);
    } else {
      return observableOf([new Breadcrumb(this.translationService.instant(this.QUALITY_ASSURANCE_BREADCRUMB_KEY), url),
        new Breadcrumb(sourceId, `${url}${sourceId}`)]);
    }

  }
}
