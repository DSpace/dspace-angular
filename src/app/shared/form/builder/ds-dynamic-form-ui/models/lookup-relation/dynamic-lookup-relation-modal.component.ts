import { Component, OnInit } from '@angular/core';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { SearchResult } from '../../../../../../+search-page/search-result.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { Observable } from 'rxjs';
import { SearchService } from '../../../../../../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../../../../../../+search-page/paginated-search-options.model';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';

const RELATION_TYPE_FILTER_PREFIX = 'f.entityType=';

/* TODO take a look at this when the REST entities submission is finished: we will probably need to get the fixed filter from the REST instead of filtering is out from the metadata field */
const RELATION_TYPE_METADATA_PREFIX = 'relation.isPublicationOf';

@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
  styleUrls: ['./dynamic-lookup-relation-modal.component.scss'],
  templateUrl: './dynamic-lookup-relation-modal.component.html'
})
export class DsDynamicLookupRelationModalComponent implements OnInit {
  relationKey: string;
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;
  searchConfig: PaginatedSearchOptions;

  constructor(private searchService: SearchService) {
  }

  ngOnInit(): void {
    const pagination = Object.assign(new PaginationComponentOptions(), { pageSize: 5 });
    this.searchConfig = new PaginatedSearchOptions({
      pagination: pagination,
      fixedFilter: RELATION_TYPE_FILTER_PREFIX + this.relationKey.substring(RELATION_TYPE_METADATA_PREFIX.length)
    });
    this.resultsRD$ = this.searchService.search(this.searchConfig);
  }

  onPaginationChange() {}
}