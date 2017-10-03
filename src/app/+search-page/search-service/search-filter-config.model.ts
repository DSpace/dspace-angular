import { FilterType } from './filter-type.model';

export class SearchFilterConfig {

  name: string;
  type: FilterType;
  hasFacets: boolean;
  isOpenByDefault: boolean;
}
