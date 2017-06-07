import { SortOptions } from "../cache/models/sort-options.model";
import { PaginationOptions } from "../cache/models/pagination-options.model";
import { GenericConstructor } from "../shared/generic-constructor";

export class Request<T> {
  constructor(
    public href: string,
  ) {}
}

export class FindByIDRequest<T> extends Request<T> {
  constructor(
    href: string,
    public resourceID: string
  ) {
    super(href);
  }
}

export class FindAllRequest<T> extends Request<T> {
  constructor(
    href: string,
    public scopeID?: string,
    public paginationOptions?: PaginationOptions,
    public sortOptions?: SortOptions
  ) {
    super(href);
  }
}

export class RequestError extends Error {
  statusText: string;
}
