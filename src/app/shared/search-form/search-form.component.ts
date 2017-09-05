import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent {
  @Input() query: string;
  @Input() scope: DSpaceObject;

  // Optional existing search parameters
  @Input() currentParams: {};

  constructor(private router: Router) {
  }

  onSubmit(form: any, scope ?: string) {
    const data: any = Object.assign({}, form, { scope: scope });
    this.updateSearch(data);

  }

  updateSearch(data: any) {
    this.router.navigate(['/search'], {
      queryParams: Object.assign({}, this.currentParams,
        {
          query: data.query,
          scope: data.scope,
          page: data.page || 1
        }
      )
    })
    ;
  }
}
