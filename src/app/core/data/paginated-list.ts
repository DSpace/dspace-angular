import { PageInfo } from '../shared/page-info.model';
import { hasValue } from '../../shared/empty.util';

export class PaginatedList<T> {

  constructor(public pageInfo: PageInfo,
              public page: T[]) {
  }

  get elementsPerPage(): number {
    if (hasValue(this.pageInfo) && hasValue(this.pageInfo.elementsPerPage)) {
      return this.pageInfo.elementsPerPage;
    }
    return this.getPageLength();
  }

  set elementsPerPage(value: number) {
    this.pageInfo.elementsPerPage = value;
  }

  get totalElements(): number {
    if (hasValue(this.pageInfo) && hasValue(this.pageInfo.totalElements)) {
      return this.pageInfo.totalElements;
    }
    return this.getPageLength();
  }

  set totalElements(value: number) {
    this.pageInfo.totalElements = value;
  }

  get totalPages(): number {
    if (hasValue(this.pageInfo) && hasValue(this.pageInfo.totalPages)) {
      return this.pageInfo.totalPages;
    }
    return 1;
  }

  set totalPages(value: number) {
    this.pageInfo.totalPages = value;
  }

  get currentPage(): number {
    if (hasValue(this.pageInfo) && hasValue(this.pageInfo.currentPage)) {
      return this.pageInfo.currentPage;
    }
    return 1;
  }

  set currentPage(value: number) {
    this.pageInfo.currentPage = value;
  }

  get first(): string {
    return this.pageInfo.first;
  }

  set first(first: string) {
    this.pageInfo._links.first = { href: first };
  }

  get prev(): string {
    return this.pageInfo.prev;
  }
  set prev(prev: string) {
    this.pageInfo._links.prev = { href: prev };
  }

  get next(): string {
    return this.pageInfo.next;
  }

  set next(next: string) {
    this.pageInfo._links.next = { href: next };
  }

  get last(): string {
    return this.pageInfo.last;
  }

  set last(last: string) {
    this.pageInfo._links.last = { href: last };
  }

  get self(): string {
    return this.pageInfo.self;
  }

  set self(self: string) {
    this.pageInfo._links.self = { href: self };
  }

  protected getPageLength() {
    return (Array.isArray(this.page)) ? this.page.length : 0;
  }
}
