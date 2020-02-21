import { BreadcrumbsService } from '../../core/breadcrumbs/breadcrumbs.service';

export interface BreadcrumbConfig<T> {
    provider: BreadcrumbsService<T>;
    key: T;
    url?: string;
}
