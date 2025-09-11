import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { getCollectionEditRoute } from '../../../../../collection-page/collection-page-routing-paths';
import { Collection } from '../../../../../core/shared/collection.model';
import { Context } from '../../../../../core/shared/context.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { CollectionSearchResult } from '../../../../../shared/object-collection/shared/collection-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { CollectionSearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/collection-search-result/collection-search-result-grid-element.component';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';

@listableObjectComponent(CollectionSearchResult, ViewMode.GridElement, Context.AdminSearch)
@Component({
  selector: 'ds-collection-admin-search-result-list-element',
  styleUrls: ['./collection-admin-search-result-grid-element.component.scss'],
  templateUrl: './collection-admin-search-result-grid-element.component.html',
  standalone: true,
  imports: [
    CollectionSearchResultGridElementComponent,
    RouterLink,
  ],
})
/**
 * The component for displaying a list element for a collection search result on the admin search page
 */
export class CollectionAdminSearchResultGridElementComponent extends SearchResultGridElementComponent<CollectionSearchResult, Collection> implements OnInit {
  editPath: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.editPath = getCollectionEditRoute(this.dso.uuid);
  }
}
