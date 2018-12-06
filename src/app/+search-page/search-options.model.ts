import 'core-js/library/fn/object/entries';

import { SearchFilter } from './search-filter.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { isNotEmpty } from '../shared/empty.util';

/**
 * This model class represents all parameters needed to request information about a certain search request
 */
export class SearchOptions {
  scope?: string;
  query?: string;
  dsoType?: DSpaceObjectType;
  filters?: SearchFilter[];

  constructor(options: {scope?: string, query?: string, dsoType?: DSpaceObjectType, filters?: SearchFilter[]}) {
      this.scope = options.scope;
      this.query = options.query;
      this.dsoType = options.dsoType;
      this.filters = options.filters;
  }

  /**
   * Method to generate the URL that can be used request information about a search request
   * @param {string} url The URL to the REST endpoint
   * @param {string[]} args A list of query arguments that should be included in the URL
   * @returns {string} URL with all search options and passed arguments as query parameters
   */
  toRestUrl(url: string, args: string[] = []): string {

    if (isNotEmpty(this.query)) {
      args.push(`query=${this.query}`);
    }
    if (isNotEmpty(this.scope)) {
      args.push(`scope=${this.scope}`);
    }
    if (isNotEmpty(this.dsoType)) {
      args.push(`dsoType=${this.dsoType}`);
    }
    if (isNotEmpty(this.filters)) {
      this.filters.forEach((filter: SearchFilter) => {
        filter.values.forEach((value) => args.push(`${filter.key}=${value},${filter.operator}`));
      });
    }
    if (isNotEmpty(args)) {
      url = new URLCombiner(url, `?${args.join('&')}`).toString();
    }
    return url;
  }
}
