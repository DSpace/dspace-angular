import { Injectable } from '@angular/core';
import { BreadcrumbsProviderService } from '@dspace/core/breadcrumbs/breadcrumbsProviderService';
import { Breadcrumb } from '@dspace/core/breadcrumbs/models/breadcrumb.model';
import { Process } from '@dspace/core/processes/process.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  Observable,
  of,
} from 'rxjs';

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
