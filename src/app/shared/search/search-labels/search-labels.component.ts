import { Component, Input, OnInit } from '@angular/core';
import { AppliedFilter } from '../models/applied-filter.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent implements OnInit {

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  appliedFilters$: BehaviorSubject<AppliedFilter[]>;

  constructor(
    protected searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.appliedFilters$ = this.searchService.appliedFilters$;
  }

}
