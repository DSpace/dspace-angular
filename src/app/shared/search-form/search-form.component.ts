import { Component, Input } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router } from '@angular/router';
import { hasValue, isNotEmpty } from '../empty.util';
import { QueryParamsHandling } from '@angular/router/src/config';
import { MYDSPACE_ROUTE } from '../../+my-dspace-page/my-dspace-page.component';
import { SearchService } from '../../+search-page/search-service/search.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  // templateUrl: './search-form.component.html',
  templateUrl: './themes/search-form.component.mantis.html'
})

/**
 * Component that represents the search form
 */
export class SearchFormComponent {
  /**
   * The search query
   */
  @Input() query: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;

  /**
   * The currently selected scope object's UUID
   */
  @Input()
  scope = '';

  @Input() currentUrl: string;

  /**
   * The available scopes
   */
  @Input() scopes: DSpaceObject[];

  /**
   * Whether or not the search button should be displayed large
   */
  @Input() large = false;

  /**
   * The brand color of the search button
   */
  @Input() brandColor = 'primary';

  constructor(private router: Router, private searchService: SearchService) {
  }

  /**
   * Updates the search when the form is submitted
   * @param data Values submitted using the form
   */
  onSubmit(data: any) {
    this.updateSearch(data);
  }

  /**
   * Updates the search when the current scope has been changed
   * @param {string} scope The new scope
   */
  onScopeChange(scope: string) {
    this.updateSearch({ scope });
  }

  /**
   * Updates the search URL
   * @param data Updated parameters
   */
  updateSearch(data: any) {
    this.router.navigate(this.getSearchLinkParts(), {
      queryParams: Object.assign({}, { page: 1 }, data),
      queryParamsHandling: 'merge'
    });
  }

  /**
   * For usage of the isNotEmpty function in the template
   */
  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return './';
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
}
