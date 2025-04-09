import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  Params,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginationService } from '../../../../core/pagination/pagination.service';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { SearchService } from '../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../core/shared/search/search-filter.service';
import { isNotEmpty } from '../../../empty.util';
import { currentPath } from '../../../utils/route.utils';
import { VarDirective } from '../../../utils/var.directive';
import { AppliedFilter } from '../../models/applied-filter.model';

/**
 * Component that represents the label containing the currently active filters
 */
@Component({
  selector: 'ds-search-label',
  templateUrl: './search-label.component.html',
  styleUrls: ['./search-label.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe, TranslateModule, VarDirective],
})
export class SearchLabelComponent implements OnInit {
  @Input() inPlaceSearch: boolean;
  @Input() appliedFilter: AppliedFilter;
  searchLink: string;
  removeParameters$: Observable<Params>;

  filterLabel$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Initialize the instance variable
   */
  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected searchConfigurationService: SearchConfigurationService,
    protected searchService: SearchService,
    protected searchFilterService: SearchFilterService,
    protected itemDataService: ItemDataService,
    protected dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.searchLink = this.getSearchLink();
    this.removeParameters$ = this.updateRemoveParams();
    this.setFilterValue();
  }

  /**
   * Calculates the parameters that should change if this {@link appliedFilter} would be removed from the active filters
   */
  updateRemoveParams(): Observable<Params> {
    return this.searchConfigurationService.unselectAppliedFilterParams(this.appliedFilter.filter, this.appliedFilter.value, this.appliedFilter.operator);
  }

  /**
   * Retrieves and sets the appropriate filter value based on the given input, updating the filterValue accordingly.
   * @returns {void}
   */
  setFilterValue(): void{
    if (this.appliedFilter.operator === 'authority') {
      const id = this.appliedFilter.value;
      this.itemDataService.findById(id).pipe(
        getFirstCompletedRemoteData(),
        map((rq)=> rq.hasSucceeded ? rq.payload : null),
      ).subscribe((result)=>{
        let tmpValue: string;
        if (isNotEmpty(result)){
          tmpValue = this.dsoNameService.getName(result);
        } else {
          tmpValue = this.appliedFilter.value;
        }
        this.filterLabel$.next(tmpValue);
      });
    } else {
      this.filterLabel$.next(this.appliedFilter.label);
    }
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

}
