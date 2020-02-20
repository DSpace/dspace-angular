import { BreadcrumbsService } from '../../core/breadcrumbs/breadcrumbs.service';

export interface BreadcrumbConfig {
    provider: BreadcrumbsService;
    key: string;
    url?: string;
}
