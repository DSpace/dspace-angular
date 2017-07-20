import { SortOptions } from '../cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { GenericConstructor } from '../shared/generic-constructor';

/* tslint:disable:max-classes-per-file */
export class Request<T> {
  constructor(
    public href: string,
  ) { }
}

export class FindByIDRequest<T> extends Request<T> {
  constructor(
    href: string,
    public resourceID: string
  ) {
    super(href);
  }
}

export class FindAllOptions {
  scopeID?: string;
  elementsPerPage?: number;
  currentPage?: number;
  sort?: SortOptions;
}

export class FindAllRequest<T> extends Request<T> {
  constructor(
    href: string,
    public options?: FindAllOptions,
  ) {
    super(href);
  }
}

export class RequestError extends Error {
  statusText: string;
}
/* tslint:enable:max-classes-per-file */
