import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AppliedFilter } from '@dspace/core/shared/search/models/applied-filter.model';
import { BehaviorSubject } from 'rxjs';

import { SearchService } from '../search.service';
import { SearchLabelLoaderComponent } from './search-label-loader/search-label-loader.component';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    SearchLabelLoaderComponent,
  ],
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
