import { autoserialize, deserialize } from 'cerialize';

import { HALLink } from '../../../core/shared/hal-link.model';
import { typedObject } from '../../../core/cache/builders/build-decorators';
import { CacheableObject } from '../../../core/cache/object-cache.reducer';
import { SEARCH_CONFIG } from './search-config.resource-type';
import { ResourceType } from '../../../core/shared/resource-type';

/**
 * The configuration for a search
 */
@typedObject
export class SearchConfig implements CacheableObject {
  static type = SEARCH_CONFIG;

    /**
     * The id of this search configuration.
     */
    @autoserialize
    id: string;

    /**
     * The configured filters.
     */
    @autoserialize
    filters: FilterConfig[];

    /**
     * The configured sort options.
     */
    @autoserialize
    sortOptions: SortOption[];

    /**
     * The object type.
     */
    @autoserialize
    type: ResourceType;

    /**
     * The {@link HALLink}s for this Item
     */
    @deserialize
    _links: {
        facets: HALLink;
        objects: HALLink;
        self: HALLink;
    };
}

/**
 * Interface to model filter's configuration.
 */
export interface FilterConfig {
    filter: string;
    hasFacets: boolean;
    operators: OperatorConfig[];
    openByDefault: boolean;
    pageSize: number;
    type: string;
}

/**
 * Interface to model sort option's configuration.
 */
export interface SortOption {
    name: string;
}

/**
 * Interface to model operator's configuration.
 */
export interface OperatorConfig {
    operator: string;
}
