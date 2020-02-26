import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Observable, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';

export const BREADCRUMB_MESSAGE_POSTFIX = '.breadcrumbs';

@Injectable()
export class I18nBreadcrumbsService implements BreadcrumbsService<string> {
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return observableOf([new Breadcrumb(key + BREADCRUMB_MESSAGE_POSTFIX, url)]);
  }
}
