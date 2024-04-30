import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Context } from '../../../../core/shared/context.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { CollectionElementLinkType } from '../../collection-element-link.type';
import { ListableObject } from '../listable-object.model';

@Component({
  selector: 'ds-abstract-object-element',
  template: ``,
  standalone: true,
})
export class AbstractListableElementComponent<T extends ListableObject> {

  /**
   * The object to render in this list element
   */
  @Input() object: T;

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
   * The index of this element
   */
  @Input() index: number;

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
  @Output() reloadedObject = new EventEmitter<DSpaceObject>();

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

  constructor(
    public dsoNameService: DSONameService,
  ) {
  }

}
