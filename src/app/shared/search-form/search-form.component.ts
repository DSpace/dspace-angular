import { Component, Input } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router } from '@angular/router';
import { isNotEmpty, hasValue, isEmpty, hasNoValue } from '../empty.util';
import { QueryParamsHandling } from '@angular/router/src/config';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html'
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
   * The currently selected scope object's UUID
   */
  @Input()
  scope = '';

  @Input() currentUrl: string;

  /**
   * The available scopes
   */
  @Input() scopes: DSpaceObject[];

  constructor(private router: Router) {
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
    const newUrl = hasValue(this.currentUrl) ? this.currentUrl : '/search';
    let handling: QueryParamsHandling = '' ;
    if (this.currentUrl === '/search') {
      handling = 'merge';
    }
    this.router.navigate([newUrl], {
      queryParams: Object.assign({}, { page: 1 }, data),
      queryParamsHandling: handling
    });
  }

  /**
   * For usage of the isNotEmpty function in the template
   */
  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

}
