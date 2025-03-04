export interface SearchAutocompleteFilterConfig {
  faceName: string;
  origin: string;
  queryParams: { [key: string]: any };
  queryPredicate?: 'contains' | 'equals';
  type?: 'browser' | 'facets';
}
