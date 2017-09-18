import { Component, Input, OnInit } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Router } from '@angular/router';
import { isNotEmpty, hasValue, isEmpty } from '../empty.util';
import { Observable } from 'rxjs/Observable';

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
  selectedId = '';
  // Optional existing search parameters
  @Input() currentParams: {};
  @Input() scopes: Observable<DSpaceObject[]>;
  scopeOptions: string[] = [];

  @Input()
  set scope(dso: DSpaceObject) {
    if (hasValue(dso)) {
      this.selectedId = dso.id;
    }
  }

  ngOnInit(): void {
    this.scopes
      .filter((scopes: DSpaceObject[]) => isEmpty(scopes))
      .subscribe((scopes: DSpaceObject[]) => {
          this.scopeOptions = scopes
            .map((scope: DSpaceObject) => scope.id);
        }
      );
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
          scope: data.scope || undefined,
          page: data.page || 1
        }
      )
    })
    ;
  }

  byId(id1: string, id2: string) {
    if (isEmpty(id1) && isEmpty(id2)) {
      return true;
    }
    return id1 === id2;
  }
}
