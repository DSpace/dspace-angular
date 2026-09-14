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
 * The search box in the header that expands on focus and collapses on focus out
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

  // Search input field
  @ViewChild('searchInput') searchField: ElementRef;
  // Whether the collapse animation is still running, keeps the dropdown visible until it finishes
  collapsing = false;

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
    if (!this.searchExpanded) {
      return;
    }
    this.searchField.nativeElement.blur();
    this.searchExpanded = false;
    this.isExpanded = 'collapsed';
    this.collapsing = true;
  }

  /**
   * Called when the expand/collapse animation finishes
   */
  onAnimationDone(): void {
    // The animation's "done" event can fire synchronously while Angular is still
    // running change detection (e.g. in tests). Deferring the state change avoids
    // ExpressionChangedAfterItHasBeenCheckedError. The component's OnPush ancestors
    // are not notified when the flag is reset outside an event handler, so the view
    // has to be marked for check explicitly.
    setTimeout(() => {
      this.collapsing = false;
      this.cdr.markForCheck();
    });
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
