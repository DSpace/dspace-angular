import { Component, Inject } from '@angular/core';
import { ListableObject } from '../listable-object/listable-object.model';

@Component({
  selector: 'ds-object-list-element',
  styleUrls: ['./object-list-element.component.scss'],
  templateUrl: './object-list-element.component.html'
})
export class ObjectListElementComponent {

  // In the current version of Angular4, @Input is not supported by the NgComponentOutlet - instead we're using DI
  constructor(@Inject('objectElementProvider') public object: ListableObject) { }
}
