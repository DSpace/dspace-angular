import { Component, Input } from '@angular/core';
import { SearchService } from '../../+search-page/search-service/search.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router } from '@angular/router';
import { isNotEmpty, hasValue, isEmpty, hasNoValue } from '../empty.util';

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
export class SearchFormComponent {
  @Input() query: string;
  selectedId = '';
  @Input() currentUrl: string;
  @Input() scopes: DSpaceObject[];

  @Input()
  set scope(id: string) {
    this.selectedId = id;
  }

  constructor(private router: Router) {
  }

  onSubmit(data: any) {
    this.updateSearch(data);
  }

  updateSearch(data: any) {
    const newUrl = hasValue(this.currentUrl) ? this.currentUrl : 'search';
    this.router.navigate([newUrl], {
      queryParams: {
        query: data.query,
        scope: data.scope || undefined,
        page: data.page || 1
      },
      queryParamsHandling: 'merge'
    });
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

}
