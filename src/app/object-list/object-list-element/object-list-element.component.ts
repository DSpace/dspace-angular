import { Component, Inject } from '@angular/core';
import { ListableObject } from '../../object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-object-list-element',
  styleUrls: ['./object-list-element.component.scss'],
  templateUrl: './object-list-element.component.html'
})
export class ObjectListElementComponent <T extends ListableObject> {
  object: T;
  public constructor(@Inject('objectElementProvider') public listable: ListableObject) {
    this.object = listable as T;
  }
}
