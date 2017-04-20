import { SortOptions } from "../cache/models/sort-options.model";
import { PaginationOptions } from "../cache/models/pagination-options.model";
import { GenericConstructor } from "../shared/generic-constructor";

export class Request<T> {
  constructor(
    public href: string,
    public resourceType: GenericConstructor<T>
  ) {}
}

export class FindByIDRequest<T> extends Request<T> {
  constructor(
    href: string,
    resourceType: GenericConstructor<T>,
    public resourceID: string
  ) {
    super(href, resourceType);
  }
}

export class FindAllRequest<T> extends Request<T> {
  constructor(
    href: string,
    resourceType: GenericConstructor<T>,
    public scopeID?: string,
    public paginationOptions?: PaginationOptions,
    public sortOptions?: SortOptions
  ) {
    super(href, resourceType);
  }
}
