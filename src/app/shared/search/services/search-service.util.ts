/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { hasValue } from '../../empty.util';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { SearchOptions } from '../models/search-options.model';

/**
 * Utility function to parse an options object to a {@link FindListOptions} for use in find-list data-service methods
 * @param options
 */
export function parseFindListOptions(options?: FindListOptions | SearchOptions): FindListOptions {
  let findListOptions: FindListOptions;
  if (hasValue(options) && (options instanceof SearchOptions || options instanceof PaginatedSearchOptions)) {
    findListOptions = options.toFindListOptions();
  } else {
    findListOptions = options;
  }
  return findListOptions;
}
