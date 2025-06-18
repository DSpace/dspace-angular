import {
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SearchService } from '../core/shared/search/search.service';
import { expandSearchInput } from '../shared/animations/slide';
import { BrowserOnlyPipe } from '../shared/utils/browser-only.pipe';
import { ClickOutsideDirective } from '../shared/utils/click-outside.directive';

/**
 * The search box in the header that expands on focus and collapses on focus out
 */
@Component({
  selector: 'ds-base-search-navbar',
  templateUrl: './search-navbar.component.html',
  styleUrls: ['./search-navbar.component.scss'],
  animations: [expandSearchInput],
  standalone: true,
  imports: [
    BrowserOnlyPipe,
    ClickOutsideDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class SearchNavbarComponent {

  // The search form
  searchForm;
  // Whether or not the search bar is expanded, boolean for html ngIf, string for AngularAnimation state change
  searchExpanded = false;
  isExpanded = 'collapsed';

  // Search input field
  @ViewChild('searchInput') searchField: ElementRef;

  constructor(private formBuilder: UntypedFormBuilder, private router: Router, private searchService: SearchService) {
    this.searchForm = this.formBuilder.group(({
      query: '',
    }));
  }

  /**
   * Expands search bar by angular animation, see expandSearchInput
   */
  expand() {
    this.searchExpanded = true;
    this.isExpanded = 'expanded';
    this.editSearch();
  }

  /**
   * Collapses & blurs search bar by angular animation, see expandSearchInput
   */
  collapse() {
    this.searchField.nativeElement.blur();
    this.searchExpanded = false;
    this.isExpanded = 'collapsed';
  }

  /**
   * Focuses on input search bar so search can be edited
   */
  editSearch(): void {
    this.searchField.nativeElement.focus();
  }

  /**
   * Submits the search (on enter or on search icon click)
   * @param data  Data for the searchForm, containing the search query
   */
  onSubmit(data: any) {
    this.collapse();
    const queryParams = Object.assign({}, data);
    const linkToNavigateTo = [this.searchService.getSearchLink().replace('/', '')];
    this.searchForm.reset();

    this.router.navigate(linkToNavigateTo, {
      queryParams: queryParams,
    });
  }
}
