import {
  autoserialize,
  deserialize,
} from 'cerialize';

import { link, typedObject } from '../../../core/cache/builders/build-decorators';
import { CacheableObject } from '../../../core/cache/cacheable-object.model';
import { HALLink } from '../../../core/shared/hal-link.model';
import { excludeFromEquals } from '../../../core/utilities/equals.decorators';
import { DISCOVERY_CONFIGURATION } from './types/discovery-configuration.resource-type';
import { ResourceType } from '../../../core/shared/resource-type';
import { SEARCH_FILTER_CONFIG } from './types/search-filter-config.resource-type';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { SEARCH_SORT_OPTION } from './types/search-sort-option.resource-type';
import { SearchSortOption } from './search-sort-option.model';

/**
 * Model representing a Discovery configuration from the REST API
 */
@typedObject
export class DiscoveryConfiguration implements CacheableObject {
  static type = DISCOVERY_CONFIGURATION;

  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  @autoserialize
  id: string;

  @deserialize
  _links: {
    self: HALLink;
    searchfilters?: HALLink;
    sortoptions?: HALLink;
    defaultsortoption?: HALLink;
  };

  @link(SEARCH_FILTER_CONFIG, true)
  searchfilters?: Observable<RemoteData<PaginatedList<SearchFilterConfig>>>;

  @link(SEARCH_SORT_OPTION, true)
  sortoptions?: Observable<RemoteData<PaginatedList<SearchSortOption>>>;

  @link(SEARCH_SORT_OPTION)
  defaultsortoption?: Observable<RemoteData<SearchSortOption>>;
}
