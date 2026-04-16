import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { DSpaceObjectType } from '@dspace/core/shared/dspace-object-type.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';

import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { SearchService } from '../../../shared/search/search.service';
import { getItemEditRoute } from '../../item-page-routing-paths';

/**
 * Component shown on the item page when a custom URL lookup returns a 500 error,
 * which indicates that multiple items share the same `dspace.customurl` value.
 *
 * Uses `SearchService.search()` with a `dspace.customurl` filter to find all items
 * with the conflicting value, then renders a direct edit link (`/edit-items/<uuid>:FULL`)
 * for each result so administrators can immediately navigate to and fix the affected items.
 *
 * Usage: placed inside the item page template when `itemRD.statusCode === 500`
 * and the resolved route param is not a UUID (i.e. it was a custom URL lookup).
 */
@Component({
  selector: 'ds-custom-url-conflict-error',
  templateUrl: './custom-url-conflict-error.component.html',
  imports: [
    AlertComponent,
    AsyncPipe,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class CustomUrlConflictErrorComponent implements OnInit {

  /** The custom URL value that caused the conflict (the route param). */
  @Input() customUrl: string;

  /** AlertType enum reference for the template */
  readonly AlertTypeEnum = AlertType;

  /**
   * Observable emitting the list of items that share the conflicting custom URL.
   * Each entry contains the item's uuid, display name, and a direct edit link
   * pointing to `/edit-items/<uuid>:FULL`.
   */
  conflictingItems$: Observable<{ uuid: string; name: string; editLink: string }[]>;

  /** Observable emitting whether the current user is authenticated. */
  isAuthenticated$: Observable<boolean>;

  constructor(
    private searchService: SearchService,
    private dsoNameService: DSONameService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    const searchOptions = new PaginatedSearchOptions({
      dsoTypes: [DSpaceObjectType.ITEM],
      query: `dspace.customurl:${this.customUrl}`,
    });

    this.conflictingItems$ = this.searchService.search<Item>(searchOptions).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<SearchObjects<Item>>) => {
        if (rd.hasSucceeded && rd.payload?.page?.length > 0) {
          return rd.payload.page.map((result: SearchResult<Item>) => {
            const item = result.indexableObject;
            return {
              uuid: item.uuid,
              name: this.dsoNameService.getName(item),
              editLink: new URLCombiner(getItemEditRoute(item, true), 'metadata').toString(),
            };
          });
        }
        return [];
      }),
      catchError(() => of([])),
    );
  }
}
