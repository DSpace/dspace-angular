import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Observable } from 'rxjs';

export class DSOBreadcrumbsService implements BreadcrumbsService {
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {
    return undefined;
  }
}
