import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { TranslateService } from '@ngx-translate/core';
import { QualityAssuranceTopicDataService } from '../notifications/qa/topics/quality-assurance-topic-data.service';



/**
 * Service to calculate QA breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root'
})
export class QualityAssuranceBreadcrumbService implements BreadcrumbsProviderService<string> {

  private QUALITY_ASSURANCE_BREADCRUMB_KEY = 'admin.quality-assurance.breadcrumbs';
  constructor(
    protected qualityAssuranceService: QualityAssuranceTopicDataService,
    private translationService: TranslateService,
  ) {

  }


  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    const sourceId = key.split(':')[0];
    const topicId = key.split(':')[1];

    if (topicId) {
      return this.qualityAssuranceService.getTopic(topicId).pipe(
        getFirstCompletedRemoteData(),
        map((topic) => {
            return [new Breadcrumb(this.translationService.instant(this.QUALITY_ASSURANCE_BREADCRUMB_KEY), url),
              new Breadcrumb(sourceId, `${url}${sourceId}`),
              new Breadcrumb(topicId, undefined)];
        })
      );
    } else {
      return observableOf([new Breadcrumb(this.translationService.instant(this.QUALITY_ASSURANCE_BREADCRUMB_KEY), url),
        new Breadcrumb(sourceId, `${url}${sourceId}`)]);
    }

  }
}
