import { BreadcrumbsService } from '../../core/breadcrumbs/breadcrumbs.service';

/**
 * Interface for breadcrumb configuration objects
 */
export interface BreadcrumbConfig<T> {
    /**
     * The service used to calculate the breadcrumb object
     */
    provider: BreadcrumbsService<T>;

    /**
     * The key that is used to calculate the breadcrumb display value
     */
    key: T;

    /**
     * The url of the breadcrumb
     */
    url?: string;
}
