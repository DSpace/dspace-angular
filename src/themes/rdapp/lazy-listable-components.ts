/**
 * Add components that use the @listableObjectComponent decorator here.
 * This will ensure that the decorators get picked up when the app loads
 */
import { PublicationComponent } from './app/item-page/simple/item-types/publication/publication.component';
import { UntypedItemComponent } from './app/item-page/simple/item-types/untyped-item/untyped-item.component';
import { WorkspaceItemSearchResultListElementComponent } from './app/shared/object-list/my-dspace-result-list-element/workspace-item-search-result/workspace-item-search-result-list-element.component';
import { ItemSearchResultListElementComponent } from './app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';

export const LISTABLE_COMPONENTS = [
  PublicationComponent,
  UntypedItemComponent,
  ItemSearchResultListElementComponent,
  WorkspaceItemSearchResultListElementComponent,
];
