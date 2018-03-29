import { PageInfo } from '../shared/page-info.model';
import { hasValue } from '../../shared/empty.util';

export class PaginatedList<T> {

  constructor(private pageInfo: PageInfo,
              public page: T[]) {
  }

  get elementsPerPage(): number {
    if (hasValue(this.pageInfo)) {
      return this.pageInfo.elementsPerPage;
    }
    return this.page.length;
  }

  set elementsPerPage(value: number) {
    this.pageInfo.elementsPerPage = value;
  }

  get totalElements(): number {
    if (hasValue(this.pageInfo)) {
      return this.pageInfo.totalElements;
    }
    return this.page.length;
  }

  set totalElements(value: number) {
    this.pageInfo.totalElements = value;
  }

  get totalPages(): number {
    if (hasValue(this.pageInfo)) {
      return this.pageInfo.totalPages;
    }
    return 1;
  }

  set totalPages(value: number) {
    this.pageInfo.totalPages = value;
  }

  get currentPage(): number {
    if (hasValue(this.pageInfo)) {
      return this.pageInfo.currentPage;
    }
    return 1;

  }

  set currentPage(value: number) {
    this.pageInfo.currentPage = value;
  }
}
