import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { getCollectionEditRoute } from '../../../../../collection-page/collection-page-routing-paths';
import { Collection } from '../../../../../core/shared/collection.model';
import { Context } from '../../../../../core/shared/context.model';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { CollectionSearchResult } from '../../../../../shared/object-collection/shared/collection-search-result.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { CollectionSearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';

@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement, Context.AdminSearch)
@Component({
  selector: 'ds-collection-admin-search-result-list-element',
  styleUrls: ['./collection-admin-search-result-list-element.component.scss'],
  templateUrl: './collection-admin-search-result-list-element.component.html',
  standalone: true,
  imports: [
    CollectionSearchResultListElementComponent,
    RouterLink,
    TranslateModule,
  ],
})
/**
 * The component for displaying a list element for a collection search result on the admin search page
 */
export class CollectionAdminSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> implements OnInit {
  editPath: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.editPath = getCollectionEditRoute(this.dso.uuid);
  }
}
