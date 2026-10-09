import {
  ChangeDetectorRef,
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

import { expandSearchInput } from '../shared/animations/slide';
import { SearchService } from '../shared/search/search.service';
import { BrowserOnlyPipe } from '../shared/utils/browser-only.pipe';
import { ClickOutsideDirective } from '../shared/utils/click-outside.directive';

/**
 * The search box in the header that expands on focus and collapses on focus out.
 *
 * When collapsed, only a single icon `<button>` is rendered (no form). The form, input
 * and submit button are only rendered while the search bar is expanded; this avoids the
 * Pa11y/HTMLCS rule WCAG2AA H32.2 ("This form does not contain a submit button"), which
 * is otherwise reported on every page because the collapsed-state form had a
 * `type="button"` icon control rather than a real submit button.
 */
@Component({
  selector: 'ds-base-search-navbar',
  templateUrl: './search-navbar.component.html',
  styleUrls: ['./search-navbar.component.scss'],
  animations: [expandSearchInput],
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

  // Search input field. Only present once the form is rendered (`searchExpanded === true`).
  @ViewChild('searchInput') searchField: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
  ) {
    this.searchForm = this.formBuilder.group(({
      query: '',
    }));
  }

  /**
   * Expands the search bar and focuses the input on the next change-detection pass
   * (the input only exists once `searchExpanded` is true).
   */
  expand() {
    this.searchExpanded = true;
    this.isExpanded = 'expanded';
    // Force a synchronous render so `searchField` is populated, then focus it.
    this.cdr.detectChanges();
    this.editSearch();
  }

  /**
   * Collapses & blurs the search bar. The form, input and submit button are removed
   * from the DOM by the template's `@if (!searchExpanded)` branch.
   */
  collapse() {
    this.searchField?.nativeElement?.blur();
    this.searchExpanded = false;
    this.isExpanded = 'collapsed';
  }

  /**
   * Focuses the input search bar so it can be edited.
   */
  editSearch(): void {
    this.searchField?.nativeElement?.focus();
  }

  /**
   * Submits the search. Triggered both by Enter on the input (native form submit) and
   * by clicking the magnifying-glass icon (`<button type="submit">` inside the form).
   * @param data  Data for the searchForm, containing the search query
   */
  onSubmit(data: any) {
    const queryParams = Object.assign({}, data);
    const linkToNavigateTo = [this.searchService.getSearchLink().replace('/', '')];
    this.searchForm.reset();
    this.collapse();

    this.router.navigate(linkToNavigateTo, {
      queryParams: queryParams,
    });
  }
}
