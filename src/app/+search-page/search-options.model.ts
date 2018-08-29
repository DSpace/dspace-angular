import { isNotEmpty } from '../shared/empty.util';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import 'core-js/library/fn/object/entries';

/**
 * This model class represents all parameters needed to request information about a certain search request
 */
export class SearchOptions {
  scope?: string;
  query?: string;
  filters?: any;

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
    if (isNotEmpty(this.filters)) {
      Object.entries(this.filters).forEach(([key, values]) => {
        values.forEach((value) => args.push(`${key}=${value},query`));
      });
    }
    if (isNotEmpty(args)) {
      url = new URLCombiner(url, `?${args.join('&')}`).toString();
    }
    return url;
  }
}
