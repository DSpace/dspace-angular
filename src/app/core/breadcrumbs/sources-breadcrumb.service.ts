import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';

/**
 * Service to calculate QA breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root',
})
export class SourcesBreadcrumbService implements BreadcrumbsProviderService<string> {

  private BREADCRUMB_SUFFIX = '.breadcrumbs';
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
    const breadcrumbKey = args[0] + this.BREADCRUMB_SUFFIX;
    const sourceId = args[1];
    const topicId = args.length > 3 ? args[args.length - 1] : args[2];

    if (topicId) {
      return of( [new Breadcrumb(this.translationService.instant(breadcrumbKey), url),
        new Breadcrumb(sourceId, `${url}${sourceId}`),
        new Breadcrumb(topicId, undefined)]);
    } else {
      return of([new Breadcrumb(this.translationService.instant(breadcrumbKey), url),
        new Breadcrumb(sourceId, `${url}${sourceId}`)]);
    }

  }
}
