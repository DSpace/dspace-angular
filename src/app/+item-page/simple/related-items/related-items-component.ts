import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RelationshipService } from '../../../core/data/relationship.service';
import { FindListOptions } from '../../../core/data/request.models';
import { Subscription } from 'rxjs/internal/Subscription';
import { ViewMode } from '../../../core/shared/view-mode.model';

@Component({
  selector: 'ds-related-items',
  styleUrls: ['./related-items.component.scss'],
  templateUrl: './related-items.component.html'
})
/**
 * This component is used for displaying relations between items
 * It expects a parent item and relationship type, as well as a label to display on top
 */
export class RelatedItemsComponent implements OnInit, OnDestroy {
  /**
   * The parent of the list of related items to display
   */
  @Input() parentItem: Item;

  /**
   * The label of the relationship type to display
   * Used in sending a search request to the REST API
   */
  @Input() relationType: string;

  /**
   * Default options to start a search request with
   * Optional input, should you wish a different page size (or other options)
   */
  @Input() options = Object.assign(new FindListOptions(), { elementsPerPage: 5 });

  /**
   * An i18n label to use as a title for the list (usually describes the relation)
   */
  @Input() label: string;

  /**
   * Completely hide the component until there's at least one item visible
   */
  @HostBinding('class.d-none') hidden = true;

  /**
   * The list of related items
   */
  items$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * Search options for displaying all elements in a list
   */
  allOptions = Object.assign(new FindListOptions(), { elementsPerPage: 9999 });

  /**
   * The view-mode we're currently on
   * @type {ElementViewMode}
   */
  viewMode = ViewMode.ListElement;

  /**
   * Whether or not the list is currently expanded to show all related items
   */
  showingAll = false;

  /**
   * Subscription on items used to update the "hidden" property of this component
   */
  itemSub: Subscription;

  constructor(public relationshipService: RelationshipService) {
  }

  ngOnInit(): void {
    this.items$ = this.relationshipService.getRelatedItemsByLabel(this.parentItem, this.relationType, this.options);
    this.itemSub = this.items$.subscribe((itemsRD: RemoteData<PaginatedList<Item>>) => {
      this.hidden = !(itemsRD.hasSucceeded && itemsRD.payload && itemsRD.payload.page.length > 0);
    });
  }

  /**
   * Expand the list to display all related items
   */
  viewMore() {
    this.items$ = this.relationshipService.getRelatedItemsByLabel(this.parentItem, this.relationType, this.allOptions);
    this.showingAll = true;
  }

  /**
   * Collapse the list to display the originally displayed items
   */
  viewLess() {
    this.items$ = this.relationshipService.getRelatedItemsByLabel(this.parentItem, this.relationType, this.options);
    this.showingAll = false;
  }

  /**
   * Unsubscribe from the item subscription
   */
  ngOnDestroy(): void {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }
}
