import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { Observable } from 'rxjs';

export interface BreadcrumbsService<T> {
  getBreadcrumbs(key: T, url: string): Observable<Breadcrumb[]>;
}
