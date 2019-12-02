import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { Observable } from 'rxjs';
import { ListableObject } from '../../../../../object-collection/shared/listable-object.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { map, switchMap, take } from 'rxjs/operators';
import { createSuccessfulRemoteDataObject } from '../../../../../testing/utils';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { Router } from '@angular/router';
import { PaginatedSearchOptions } from '../../../../../search/paginated-search-options.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { Context } from '../../../../../../core/shared/context.model';

@Component({
  selector: 'ds-dynamic-lookup-relation-selection-tab',
  styleUrls: ['./dynamic-lookup-relation-selection-tab.component.scss'],
  templateUrl: './dynamic-lookup-relation-selection-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ]
})

export class DsDynamicLookupRelationSelectionTabComponent {
  @Input() label: string;
  @Input() listId: string;
  @Input() repeatable: boolean;
  @Input() selection$: Observable<ListableObject[]>;
  @Input() selectionRD$: Observable<RemoteData<PaginatedList<ListableObject>>>;
  @Input() context: Context;
  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();
  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  constructor(private router: Router,
              private searchConfigService: SearchConfigurationService) {
  }

  ngOnInit() {
    this.selectionRD$ = this.searchConfigService.paginatedSearchOptions
      .pipe(
        map((options: PaginatedSearchOptions) => options.pagination),
        switchMap((pagination: PaginationComponentOptions) => {
          return this.selection$.pipe(
            take(1),
            map((selected) => {
              const offset = (pagination.currentPage - 1) * pagination.pageSize;
              const end = (offset + pagination.pageSize) > selected.length ? selected.length : offset + pagination.pageSize;
              const selection = selected.slice(offset, end);
              const pageInfo = new PageInfo(
                {
                  elementsPerPage: pagination.pageSize,
                  totalElements: selected.length,
                  currentPage: pagination.currentPage,
                  totalPages: Math.ceil(selected.length / pagination.pageSize)
                });
              return createSuccessfulRemoteDataObject(new PaginatedList(pageInfo, selection));
            })
          );
        })
      )
  }
}
