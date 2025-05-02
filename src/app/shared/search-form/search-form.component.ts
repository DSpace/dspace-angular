import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  startWith,
  take,
} from 'rxjs/operators';

import { AutocompleteOption } from '../../../config/autocomplete.option.interface';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { AutocompleteService } from '../../core/services/autocomplete.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { SearchService } from '../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../core/shared/search/search-filter.service';
import {
  hasValue,
  isNotEmpty,
} from '../empty.util';
import { BrowserOnlyPipe } from '../utils/browser-only.pipe';
import { currentPath } from '../utils/route.utils';
import { ScopeSelectorModalComponent } from './scope-selector-modal/scope-selector-modal.component';

@Component({
  selector: 'ds-base-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
  standalone: true,
  imports: [FormsModule, NgbTooltipModule, AsyncPipe, TranslateModule, BrowserOnlyPipe],
})
/**
 * Component that represents the search form
 */
export class SearchFormComponent implements OnChanges {
  /**
   * The search query
   */
  @Input() query: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * The currently selected scope object's UUID
   */
  @Input()
  scope = '';

  /**
   * Hides the scope in the url, this can be useful when you hardcode the scope in another way
   */
  @Input() hideScopeInUrl = false;

  selectedScope: BehaviorSubject<DSpaceObject> = new BehaviorSubject<DSpaceObject>(undefined);

  @Input() currentUrl: string;

  /**
   * Whether or not the search button should be displayed large
   */
  @Input() large = false;

  /**
   * The brand color of the search button
   */
  @Input() brandColor = 'primary';

  /**
   * The placeholder of the search input
   */
  @Input() searchPlaceholder: string;

  /**
   * Defines whether or not to show the scope selector
   */
  @Input() showScopeSelector = false;

  /**
   * Output the search data on submit
   */
  @Output() submitSearch = new EventEmitter<any>();

  /**
   * Defines whether or not to show the clear button
   */
  @Output() showClearButton = false;


  /**
   * Defines whether or not to show the clear button
   */
  @Output() enableAdvanceFilters = false;

  /*
  * Enable or disable menu in autocomplete options
  * */
  public showMenu = false;

  /**
   * Options to list in autocomplete options
   * */
  public optionsToRender: AutocompleteOption[] = [];

  /**
   * The current selection on autocomplete options
   * */
  chosenOption: AutocompleteOption;

  constructor(
    protected router: Router,
    protected searchService: SearchService,
    protected searchFilterService: SearchFilterService,
    protected paginationService: PaginationService,
    protected searchConfig: SearchConfigurationService,
    protected modalService: NgbModal,
    protected dsoService: DSpaceObjectDataService,
    public dsoNameService: DSONameService,
    public autoCompleteService: AutocompleteService,
    private detectorRef: ChangeDetectorRef,
  ) {
    autoCompleteService.chargeOptions().subscribe(options => {
      this.optionsToRender = options;
      if (this.optionsToRender.length > 0) {
        this.chosenOption = this.optionsToRender[0];
      }
    });
  }

  /**
   * Retrieve the scope object from the URL so we can show its name
   */
  ngOnChanges(): void {
    if (isNotEmpty(this.scope)) {
      this.dsoService.findById(this.scope).pipe(getFirstSucceededRemoteDataPayload())
        .subscribe((scope: DSpaceObject) => this.selectedScope.next(scope));
    }
  }

  onChageInput(value) {
    const option = this.chosenOption;
    console.log(option);
    if (option.browse) {
      this.autoCompleteService.getResults(option?.browse,option?.queryParams(value)).pipe(
        debounceTime(250),
        startWith([]),
      ).subscribe(
        allTerms => {
          this.autoCompleteService.termsToShow = [];
          this.autoCompleteService.autocomplete(this.query,allTerms);
          this.detectorRef.detectChanges();
        },
      );

    }
  }

  /**
   * Updates the search when the form is submitted
   * @param data Values submitted using the form
   */
  onSubmit(data: any) {
    if (isNotEmpty(this.scope)) {
      data = Object.assign(data, { scope: this.scope });
    }
    this.updateSearch(data);
    this.submitSearch.emit(data);
  }

  /**
   * Updates the search when the current scope has been changed
   * @param {string} scope The new scope
   */
  onScopeChange(scope: DSpaceObject) {
    this.updateSearch({ scope: scope ? scope.uuid : undefined });
    this.searchFilterService.minimizeAll();
  }

  /**
   * Updates the search URL
   * @param data Updated parameters
   */
  updateSearch(data: any) {
    const goToFirstPage = { 'spc.page': 1 };

    let queryParams = Object.assign(
      {
        ...goToFirstPage,
      },
      data,
    );
    if (hasValue(data.scope) && this.hideScopeInUrl) {
      delete queryParams.scope;
    }

    if (this.chosenOption) {
      delete queryParams.query;
      const filterQuery = this.chosenOption.query(this.query);
      queryParams = Object.assign({
        ...queryParams,
      },filterQuery);
    }

    void this.router.navigate(this.getSearchLinkParts(), {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.inPlaceSearch) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

  /**
   * Open the scope modal so the user can select DSO as scope
   */
  openScopeModal() {
    const ref = this.modalService.open(ScopeSelectorModalComponent);
    ref.componentInstance.scopeChange.pipe(take(1)).subscribe((scope: DSpaceObject) => {
      this.selectedScope.next(scope);
      this.onScopeChange(scope);
    });
  }


  /**
   * Clear the current query
   */
  clearText() {
    this.query = '';
  }


  /*
  * Set the option selected in autocomplete options
  * */
  setOption(optionName: string) {
    this.chosenOption = this.getOption(optionName);
    this.closeTermOptionsContainer();
  }

  /**
   * Close the current option
   */
  closeTermOptionsContainer() {
    this.showMenu = false;
  }

  /*
  * Get the option selected in autocomplete options
  * */
  private getOption(optionName: string) {
    if (this.optionsToRender.length === 0) { return null; }
    return this.optionsToRender.find(({ id }: any) => id === optionName) ?? this.optionsToRender[0];
  }

  /*
  * On select the option, change de current query and reset the autocomplete options
  * */
  selectResult(value: string) {
    this.query = value;
    this.autoCompleteService.showItems = false;
    this.autoCompleteService.termsToShow = [];
  }
}
