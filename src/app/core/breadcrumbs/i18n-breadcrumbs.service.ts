import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';

/**
 * The postfix for i18n breadcrumbs
 */
export const BREADCRUMB_MESSAGE_POSTFIX = '.breadcrumbs';

/**
 * Service to calculate i18n breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root'
})
export class I18nBreadcrumbsService implements BreadcrumbsService<string> {

  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return observableOf([new Breadcrumb(key + BREADCRUMB_MESSAGE_POSTFIX, url)]);
  }
}
