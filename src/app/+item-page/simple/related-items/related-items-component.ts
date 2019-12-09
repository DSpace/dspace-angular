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
   * The max amount of relations to display
   * Defaults to 5
   * The default can optionally be overridden by providing the limit as input to the component
   */
  @Input() limit = 5;

  /**
   * The amount to increment the list by when clicking "view more"
   * Defaults to 5
   * The default can optionally be overridden by providing the limit as input to the component
   */
  @Input() incrementBy = 5;

  /**
   * Default options to start a search request with
   * Optional input
   */
  @Input() options = new FindListOptions();

  /**
   * An i18n label to use as a title for the list (usually describes the relation)
   */
  @Input() label: string;

  /**
   * Is the list (re-)loading?
   */
  loading = false;

  /**
   * The list of related items
   */
  items$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The view-mode we're currently on
   * @type {ElementViewMode}
   */
  viewMode = ViewMode.ListElement;

  /**
   * The originally provided limit
   * Used for comparing the current size with the original
   */
  originalLimit: number;

  /**
   * Subscription on items used to update the "loading" property of this component
   */
  itemSub: Subscription;

  constructor(public relationshipService: RelationshipService) {
  }

  ngOnInit(): void {
    this.originalLimit = this.limit;
    this.reloadItems();
  }

  /**
   * Reload the current list of items (using the current limit)
   */
  reloadItems() {
    this.items$ = this.relationshipService.getRelatedItemsByLabel(this.parentItem, this.relationType, Object.assign(this.options, { elementsPerPage: this.limit }));
    this.itemSub = this.items$.subscribe((itemsRD: RemoteData<PaginatedList<Item>>) => {
      this.loading = !(itemsRD.hasSucceeded && itemsRD.payload && itemsRD.payload.page.length > 0);
    });
  }

  /**
   * Expand the list to display more
   */
  viewMore() {
    this.limit = this.limit + this.incrementBy;
    this.loading = true;
    this.reloadItems();
  }

  /**
   * Collapse the list to display less
   */
  viewLess() {
    if (this.limit > this.originalLimit) {
      this.limit = this.limit - this.incrementBy;
    }
    this.loading = true;
    this.reloadItems();
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
