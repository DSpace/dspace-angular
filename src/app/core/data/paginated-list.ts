import { hasValue } from '../../shared/empty.util';
import { PageInfo } from '../shared/page-info.model';

export class PaginatedList<T> {

  constructor(private pageInfo: PageInfo,
              public page: T[]) {
  }

  get elementsPerPage(): number {
    if (hasValue(this.pageInfo) && hasValue(this.pageInfo.elementsPerPage)) {
      return this.pageInfo.elementsPerPage;
    }
    return this.page.length;
  }

  set elementsPerPage(value: number) {
    this.pageInfo.elementsPerPage = value;
  }

  get totalElements(): number {
    if (hasValue(this.pageInfo) && hasValue(this.pageInfo.totalElements)) {
      return this.pageInfo.totalElements;
    }
    return this.page.length;
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
    this.pageInfo.first = first;
  }

  get prev(): string {
    return this.pageInfo.prev;
  }
  set prev(prev: string) {
    this.pageInfo.prev = prev;
  }

  get next(): string {
    return this.pageInfo.next;
  }

  set next(next: string) {
    this.pageInfo.next = next;
  }

  get last(): string {
    return this.pageInfo.last;
  }

  set last(last: string) {
    this.pageInfo.last = last;
  }
}
