import { Component, Input, OnInit } from '@angular/core';
import { ItemMyDSpaceResult } from '../object-collection/shared/item-my-dspace-result.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';

@Component({
  selector: 'ds-duplicated',
  templateUrl: 'duplicated.component.html',
  styleUrls: ['duplicated.component.scss']
})

export class DuplicatedComponent implements OnInit {
  @Input()
  items: Observable<RemoteData<Item>>;
  object = {hitHighlights: []};
  config: PaginationComponentOptions;
  sortConfig: SortOptions;
  itemsPerPage = 2;
  currentPage = 0;

  ngOnInit(): void {
    this.config = new PaginationComponentOptions();
    this.config.id = 'duplicated_items';
    this.sortConfig = new SortOptions();
  }

  setAsDuplicated(index: number) {

  }

  setAsNotDuplicated(index: number) {

  }

  setPage(page) {
    console.log('Select page #', page);
    this.currentPage = page;
  }

}
