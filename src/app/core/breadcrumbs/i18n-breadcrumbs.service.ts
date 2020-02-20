import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Observable, of as observableOf } from 'rxjs';

export const BREADCRUMB_MESSAGE_PREFIX = 'breadcrumbs.';

export class I18nBreadcrumbsService implements BreadcrumbsService {
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return observableOf([new Breadcrumb(BREADCRUMB_MESSAGE_PREFIX + key, url)]);
  }
}
