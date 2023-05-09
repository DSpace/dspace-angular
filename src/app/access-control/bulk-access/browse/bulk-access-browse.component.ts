import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { SEARCH_CONFIG_SERVICE } from '../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../core/shared/search/search-configuration.service';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { SelectableListState } from '../../../shared/object-list/selectable-list/selectable-list.reducer';
import { RemoteData } from '../../../core/data/remote-data';
import { buildPaginatedList, PaginatedList } from '../../../core/data/paginated-list.model';
import { ListableObject } from '../../../shared/object-collection/shared/listable-object.model';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { PageInfo } from '../../../core/shared/page-info.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

@Component({
  selector: 'ds-bulk-access-browse',
  templateUrl: './bulk-access-browse.component.html',
  styleUrls: ['./bulk-access-browse.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})
export class BulkAccessBrowseComponent implements OnInit {
  /**
   * The active nav id
   */
  activateId = 'search';

  /**
   * The selection list id
   */
  listId: string = 'bulk-access-list';

  /**
   * The list of the objects already selected
   */
  objectsSelected$: BehaviorSubject<RemoteData<PaginatedList<ListableObject>>> = new BehaviorSubject<RemoteData<PaginatedList<ListableObject>>>(null);

  paginationOptions: PaginationComponentOptions;
  private subs: Subscription[] = [];

  constructor(private selectableListService: SelectableListService) {
  }

  ngOnInit(): void {
    this.paginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'elp',
      pageSize: 10,
      currentPage: 1
    });
    this.subs.push(
      this.selectableListService.getSelectableList(this.listId).pipe(
        distinctUntilChanged(),
        map((list: SelectableListState) => {
          console.log(list);
          return createSuccessfulRemoteDataObject(buildPaginatedList(new PageInfo(), list?.selection || []))
        })
      ).subscribe(this.objectsSelected$)
    )
  }

}
