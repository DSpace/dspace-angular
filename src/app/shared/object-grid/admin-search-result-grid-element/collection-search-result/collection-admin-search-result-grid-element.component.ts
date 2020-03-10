import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { Collection } from '../../../../core/shared/collection.model';
import { getCollectionEditPath } from '../../../../+collection-page/collection-page-routing.module';
import { SearchResultGridElementComponent } from '../../search-result-grid-element/search-result-grid-element.component';

@listableObjectComponent(CollectionSearchResult, ViewMode.GridElement, Context.AdminSearch)
@Component({
  selector: 'ds-collection-admin-search-result-list-element',
  styleUrls: ['./collection-admin-search-result-grid-element.component.scss'],
  templateUrl: './collection-admin-search-result-grid-element.component.html'
})
/**
 * The component for displaying a list element for a collection search result on the admin search page
 */
export class CollectionAdminSearchResultGridElementComponent extends SearchResultGridElementComponent<CollectionSearchResult, Collection> {

  /**
   * Returns the path to the edit page of this collection
   */
  getEditPath(): string {
    return getCollectionEditPath(this.dso.uuid)
  }
}
