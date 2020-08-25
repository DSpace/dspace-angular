import { autoserialize, deserialize } from 'cerialize';
import { HALLink } from 'src/app/core/shared/hal-link.model';

/**
 * The configuration for a search
 */
export class SearchConfig {

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
     * The configuration type.
     */
    @autoserialize
    type: string;

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
