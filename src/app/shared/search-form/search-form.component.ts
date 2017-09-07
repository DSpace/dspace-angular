import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router } from '@angular/router';
import { isNotEmpty, isEmpty, hasNoValue } from '../empty.util';
import { Observable } from 'rxjs';

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
export class SearchFormComponent implements OnInit {
  @Input() query: string;
  @Input() scope: Observable<DSpaceObject>;
  scopeId: string;
  // Optional existing search parameters
  @Input() currentParams: {};
  @Input() scopes: DSpaceObject[];

  ngOnInit(): void {
    this.scope.subscribe((scopeObject) => {
      this.scopeId = scopeObject.id;
      console.log("Initialized: ", scopeObject.id);
    });
  }

  constructor(private router: Router) {
  }

  onSubmit(data: any) {
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

  private isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  byId(id1: string, id2: string) {
    return id1 === id2;
  }

  onChange(): void {
    console.log('Scope: ', this.scope);
  }
}
