import { isNotEmpty } from '../empty.util';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { SearchFilter } from './search-filter.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { ViewMode } from '../../core/shared/view-mode.model';

/**
 * This model class represents all parameters needed to request information about a certain search request
 */
export class SearchOptions {
  configuration?: string;
  view?: ViewMode = ViewMode.ListElement;
  scope?: string;
  query?: string;
  dsoType?: DSpaceObjectType;
  filters?: any;
  fixedFilter?: any;

  constructor(options: {configuration?: string, scope?: string, query?: string, dsoType?: DSpaceObjectType, filters?: SearchFilter[], fixedFilter?: any}) {
      this.configuration = options.configuration;
      this.scope = options.scope;
      this.query = options.query;
      this.dsoType = options.dsoType;
      this.filters = options.filters;
      this.fixedFilter = options.fixedFilter;
  }

  /**
   * Method to generate the URL that can be used request information about a search request
   * @param {string} url The URL to the REST endpoint
   * @param {string[]} args A list of query arguments that should be included in the URL
   * @returns {string} URL with all search options and passed arguments as query parameters
   */
  toRestUrl(url: string, args: string[] = []): string {
    if (isNotEmpty(this.configuration)) {
      args.push(`configuration=${this.configuration}`);
    }
    if (isNotEmpty(this.fixedFilter)) {
      args.push(this.fixedFilter);
    }
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
        filter.values.forEach((value) => {
          const filterValue = value.includes(',') ? `${value}` : value + (filter.operator ? ',' + filter.operator : '');
          args.push(`${filter.key}=${filterValue}`)
        });
      });
    }
    if (isNotEmpty(args)) {
      url = new URLCombiner(url, `?${args.join('&')}`).toString();
    }
    return url;
  }
}
