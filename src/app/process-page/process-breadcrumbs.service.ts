import { Injectable } from '@angular/core';
import { hasValue } from '@dspace/shared/utils';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { Breadcrumb } from '@dspace/core';
import { BreadcrumbsProviderService } from '@dspace/core';
import { Process } from '@dspace/core';

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
      return observableOf([new Breadcrumb(key.processId + ' - ' + key.scriptName, url)]);
    } else {
      return observableOf([]);
    }
  }
}
