import { Component, Inject, Input } from '@angular/core';
import { ListableObject } from '../listable-object.model';

@Component({
  selector: 'ds-abstract-object-element',
  template: ``,
})
export class AbstractListableElementComponent <T extends ListableObject> {
  @Input() object: T;
}
