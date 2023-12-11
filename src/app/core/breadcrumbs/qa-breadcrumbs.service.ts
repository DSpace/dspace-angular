import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';


/**
 * Service to calculate QA breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root'
})
export class QABreadcrumbsService implements BreadcrumbsProviderService<string> {

  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return observableOf([new Breadcrumb(key + "test", url)]);
  }
}
