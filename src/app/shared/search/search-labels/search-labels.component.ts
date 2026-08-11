import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AppliedFilter } from '@dspace/core/shared/search/models/applied-filter.model';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { SearchService } from '../search.service';
import { SearchLabelLoaderComponent } from './search-label-loader/search-label-loader.component';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
  imports: [
    AsyncPipe,
    SearchLabelLoaderComponent,
  ],
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent implements OnInit, OnChanges {

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * The fixed filter query to exclude from the visible filters
   */
  @Input() fixedFilterQuery: string;

  fixedFilterQuery$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  visibleFilters$: Observable<AppliedFilter[]>;

  constructor(
    protected searchService: SearchService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fixedFilterQuery) {
      this.fixedFilterQuery$.next(this.fixedFilterQuery);
    }
  }

  ngOnInit(): void {
    this.visibleFilters$ = combineLatest([
      this.searchService.appliedFilters$,
      this.fixedFilterQuery$,
    ]).pipe(
      map(([filters, fixedFilterQuery]: [AppliedFilter[], string]) => {
        if (!filters || !fixedFilterQuery) {
          return filters;
        }
        return filters.filter((appliedFilter: AppliedFilter) =>
          !fixedFilterQuery.includes(appliedFilter.filter),
        );
      }),
    );
  }
}