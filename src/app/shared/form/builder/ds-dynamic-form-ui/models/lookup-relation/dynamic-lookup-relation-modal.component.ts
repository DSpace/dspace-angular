import { Component, OnInit } from '@angular/core';
import { PaginatedList } from '../../../../../../core/data/paginated-list';
import { SearchResult } from '../../../../../../+search-page/search-result.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { Observable } from 'rxjs';
import { SearchService } from '../../../../../../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../../../../../../+search-page/paginated-search-options.model';
import { DSpaceObject } from '../../../../../../core/shared/dspace-object.model';

const RELATION_TYPE_FILTER_PREFIX = 'f.entityType=';

@Component({
  selector: 'ds-dynamic-lookup-relation-modal',
  // styleUrls: ['./dynamic-lookup-relation-modal.component.scss'],
  templateUrl: './dynamic-lookup-relation-modal.component.html'
})
export class DsDynamicLookupRelationModalComponent implements OnInit {
  relationKey: string;
  resultsRD$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;

  constructor(private searchService: SearchService) {

  }

  ngOnInit(): void {
    this.resultsRD$ = this.searchService.search(
      new PaginatedSearchOptions({ fixedFilter: RELATION_TYPE_FILTER_PREFIX + this.relationKey }));
  }
}