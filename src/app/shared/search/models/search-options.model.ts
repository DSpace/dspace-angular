import { RequestParam } from '../../../core/cache/models/request-param.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import {
  hasValue,
  isNotEmpty,
} from '../../empty.util';
import { SearchFilter } from './search-filter.model';

/**
 * This model class represents all parameters needed to request information about a certain search request
 */
export class SearchOptions {
  configuration?: string;
  view?: ViewMode = ViewMode.ListElement;
  scope?: string;
  query?: string;
  dsoTypes?: DSpaceObjectType[];
  filters?: SearchFilter[];
  fixedFilter?: string;

  constructor(
    options: {
      configuration?: string, scope?: string, query?: string, dsoTypes?: DSpaceObjectType[], filters?: SearchFilter[],
      fixedFilter?: string
    },
  ) {
    this.configuration = options.configuration;
    this.scope = options.scope;
    this.query = options.query;
    this.dsoTypes = options.dsoTypes;
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
    this.searchParams.forEach((param: RequestParam) => {
      args.push(`${param.fieldName}=${param.fieldValue}`);
    });
    if (isNotEmpty(args)) {
      url = new URLCombiner(url, `?${args.join('&')}`).toString();
    }
    return url;
  }

  get encodedFixedFilter(): RequestParam {
    // expected format: 'arg=value'
    //  -> split the query argument into (arg)=(value) and only encode 'value'
    const match = this.fixedFilter.match(/^([^=]+)=(.+)$/);

    if (hasValue(match)) {
      return new RequestParam(match[1], this.encodeFilterQueryValue(match[2]), false);
    } else {
      return null;
    }
  }

  encodeFilterQueryValue(filterQueryValue: string): string {
    // expected format: 'value' or 'value,operator'
    //  -> split into (value)(,operator) and only encode 'value'
    const match = filterQueryValue.match(/^(.*)(,\w+)$/);

    if (hasValue(match)) {
      return encodeURIComponent(match[1]) + match[2];
    } else {
      return encodeURIComponent(filterQueryValue);
    }
  }

  /**
   * Create an array of {@link RequestParam} based on this option's parameters
   */
  get searchParams(): RequestParam[] {
    const searchParams: RequestParam[] = [];
    if (isNotEmpty(this.configuration)) {
      searchParams.push(new RequestParam('configuration', this.configuration));
    }
    if (isNotEmpty(this.fixedFilter)) {
      const fixedFilterParam = this.encodedFixedFilter;
      if (hasValue(fixedFilterParam)) {
        searchParams.push(fixedFilterParam);
      }
    }
    if (isNotEmpty(this.query)) {
      searchParams.push(new RequestParam('query', this.query));
    }
    if (isNotEmpty(this.scope)) {
      searchParams.push(new RequestParam('scope', this.scope));
    }
    if (isNotEmpty(this.dsoTypes)) {
      this.dsoTypes.forEach((dsoType: string) => {
        searchParams.push(new RequestParam('dsoType', dsoType));
      });
    }
    if (isNotEmpty(this.filters)) {
      this.filters.forEach((filter: SearchFilter) => {
        filter.values.forEach((value) => {
          const filterValue = value.includes(',') ? `${value}` : value + (filter.operator ? ',' + filter.operator : '');
          searchParams.push(new RequestParam(filter.key, this.encodeFilterQueryValue(filterValue), false));
        });
      });
    }
    return searchParams;
  }

  /**
   * Transform this {@link SearchOptions} into a {@link FindListOptions}
   */
  toFindListOptions(): FindListOptions {
    const findListOptions = new FindListOptions();
    findListOptions.searchParams = this.searchParams;
    return findListOptions;
  }
}
