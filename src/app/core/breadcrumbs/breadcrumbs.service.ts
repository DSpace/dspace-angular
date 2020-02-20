import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { Observable } from 'rxjs';

export interface BreadcrumbsService {
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]>;
}
