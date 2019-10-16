import { Component, Input } from '@angular/core';
import { ListableObject } from '../listable-object.model';
import { CollectionElementLinkType } from '../../collection-element-link.type';

@Component({
  selector: 'ds-abstract-object-element',
  template: ``,
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
   * The available link types
   */
  linkTypes = CollectionElementLinkType;
}
