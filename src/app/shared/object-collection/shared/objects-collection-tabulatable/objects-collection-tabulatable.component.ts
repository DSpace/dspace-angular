import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { CollectionElementLinkType } from '../../collection-element-link.type';
import { ListableObject } from '../listable-object.model';

@Component({
  selector: 'ds-objects-collection-tabulatable',
  template: ``,
  standalone: true,
})

/**
 * Abstract class that describe the properties for the rendering of search result's paginated lists of objects in a table.
 * To be used as descriptor of the actual result component e.g. TabulatableResultListElementsComponent
 */
export class AbstractTabulatableElementComponent<T extends PaginatedList<ListableObject>> {

  /**
   * The object to render in this list element
   */
  @Input() objects: T;

  /**
   * The link type to determine the type of link rendered in this element
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The identifier of the list this element resides in
   */
  @Input() listID: string;

  /**
   * The value to display for this element
   */
  @Input() value: string;

  /**
   * Whether to show the badge label or not
   */
  @Input() showLabel = true;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails;

  /**
   * The context we matched on to get this component
   */
  @Input() context: Context;

  /**
   * The viewmode we matched on to get this component
   */
  @Input() viewMode: ViewMode;

  /**
   * Emit when the object has been reloaded.
   */
  @Output() reloadedObject = new EventEmitter<RemoteData<PaginatedList<ListableObject>>>();

  /**
   * The available link types
   */
  linkTypes = CollectionElementLinkType;

  /**
   * The available view modes
   */
  viewModes = ViewMode;

  /**
   * The available contexts
   */
  contexts = Context;


}

