import { Component, Inject } from '@angular/core';
import { ListableObject } from '../../object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-object-grid-element',
  styleUrls: ['./object-grid-element.component.scss'],
  templateUrl: './object-grid-element.component.html'
})
export class ObjectGridElementComponent <T extends ListableObject> {
  object: T;
  public constructor(@Inject('objectElementProvider') public gridable: ListableObject) {
    this.object = gridable as T;
  }
}
