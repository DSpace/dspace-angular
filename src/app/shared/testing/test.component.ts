import { Component } from '@angular/core';

import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';

// declare a test component
@Component({ selector: 'ds-test-cmp', template: '' })
export class TestComponent {

  collection: string[] = [];
  collectionSize: number;
  paginationOptions = new PaginationComponentOptions();
  sortOptions = new SortOptions();

  constructor() {
    this.collection = Array.from(new Array(100), (x, i) => `item ${i + 1}`);
    this.collectionSize = 100;
    this.paginationOptions.id = 'test';
  }

  pageChanged(page) {
    this.paginationOptions.currentPage = page;
  }

  pageSizeChanged(pageSize) {
    this.paginationOptions.pageSize = pageSize;
  }
}
