import { findIndex } from 'lodash';

import { SortOptions } from '../../cache/models/sort-options.model';
import { FindListOptions } from '../../data/request.models';
import { SearchParam } from '../../cache/models/search-param.model';
import { isNotEmpty } from '../../../shared/empty.util';

export class IntegrationSearchOptions extends FindListOptions {

  private _uuid: string;
  public name: string;
  private _metadata: string;
  private _query: string;
  public elementsPerPage?: number;
  public currentPage?: number;
  public sort?: SortOptions;

  constructor(uuid: string = '',
              name: string = '',
              metadata: string = '',
              query: string = '',
              elementsPerPage?: number,
              currentPage?: number,
              sort?: SortOptions) {
    super();
    this.searchParams = [];

    this.name = name;
    this.query = query;
    this.metadata = metadata;
    this.uuid = uuid;
    this.elementsPerPage = elementsPerPage;
    this.currentPage = currentPage;
    this.sort = sort;
  }

  get query(): string {
    return this._query;
  }

  set query(value: string) {
    this._query = value;
    this.setParam('query', value);
  }

  get uuid(): string {
    return this._uuid;
  }

  set uuid(value: string) {
    this._uuid = value;
    this.setParam('uuid', value);
  }

  get metadata(): string {
    return this._metadata;
  }

  set metadata(value: string) {
    this._metadata = value;
    this.setParam('metadata', value);
  }

  private setParam(name, value) {
    const paramIndex = findIndex(this.searchParams, {fieldName: name});
    if (isNotEmpty(value) && paramIndex === -1) {
      this.searchParams.push(new SearchParam(name, value));
    } else if (paramIndex !== -1) {
      this.searchParams[paramIndex] = new SearchParam(name, value);
    }
  }
}
