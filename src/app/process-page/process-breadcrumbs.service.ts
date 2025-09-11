import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';

import { Breadcrumb } from '../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsProviderService } from '../core/breadcrumbs/breadcrumbsProviderService';
import { hasValue } from '../shared/empty.util';
import { Process } from './processes/process.model';

/**
 * Service to calculate process breadcrumbs for a single part of the route
 */
@Injectable({ providedIn: 'root' })
export class ProcessBreadcrumbsService implements BreadcrumbsProviderService<Process> {

  /**
   * Method to calculate the breadcrumbs
   * @param key The key used to resolve the breadcrumb
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: Process, url: string): Observable<Breadcrumb[]> {
    if (hasValue(key)) {
      return of([new Breadcrumb(key.processId + ' - ' + key.scriptName, url)]);
    } else {
      return of([]);
    }
  }
}
