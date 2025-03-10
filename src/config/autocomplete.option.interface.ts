/**
* Interface for autocomplete service
* */
export interface AutocompleteOption {
  id: string;
  label: string;
  query: (value: string) => { [key: string]: any };
  browse?:  string,
  queryParams?: (value: string) => any
}
