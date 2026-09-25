import { RequestParam } from '../cache/models/request-param.model';
import { SortOptions } from '../cache/models/sort-options.model';

/**
 * The largest page the REST API will serve. Asking for more is not an error: the API silently
 * reduces the size to this maximum, so a bigger number returns the exact same page while making the
 * request claim something the API never honours.
 *
 * The limit is Spring Data REST's `spring.data.rest.max-page-size`, which DSpace leaves at its
 * default. Use this instead of an arbitrary large number when a caller needs "everything".
 */
export const MAX_PAGE_SIZE = 1000;

/**
 * The options for a find list request
 */
export class FindListOptions {
  scopeID?: string;
  elementsPerPage?: number;
  currentPage?: number;
  sort?: SortOptions;
  searchParams?: RequestParam[];
  startsWith?: string;
  fetchThumbnail?: boolean;
}
