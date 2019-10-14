import { Component, Input } from '@angular/core';
import { ListableObject } from '../listable-object.model';
import { CollectionElementLinkType } from '../../collection-element-link.type';

@Component({
  selector: 'ds-abstract-object-element',
  template: ``,
})
export class AbstractListableElementComponent<T extends ListableObject> {
  @Input() object: T;
  @Input() linkType: CollectionElementLinkType;
  linkTypes = CollectionElementLinkType;
}
