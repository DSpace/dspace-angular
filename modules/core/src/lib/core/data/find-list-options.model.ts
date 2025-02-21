import { RequestParam } from '../cache';
import { SortOptions } from '../cache';

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
