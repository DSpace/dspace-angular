import { PageInfo } from '../shared/page-info.model';

export class PaginatedList<T> {

  constructor(
    private pageInfo: PageInfo,
    public page: T[]
  ) {
  }

  get elementsPerPage(): number {
    return this.pageInfo.elementsPerPage;
  }

  set elementsPerPage(value: number) {
    this.pageInfo.elementsPerPage = value;
  }

  get totalElements(): number {
    return this.pageInfo.totalElements;
  }

  set totalElements(value: number) {
    this.pageInfo.totalElements = value;
  }

  get totalPages(): number {
    return this.pageInfo.totalPages;
  }

  set totalPages(value: number) {
    this.pageInfo.totalPages = value;
  }

  get currentPage(): number {
    return this.pageInfo.currentPage;
  }

  set currentPage(value: number) {
    this.pageInfo.currentPage = value;
  }
}
