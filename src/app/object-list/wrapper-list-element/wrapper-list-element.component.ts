import { Component, Input, Injector, ReflectiveInjector, OnInit } from '@angular/core';
import { ListableObject } from '../listable-object/listable-object.model';
import { getListElementFor } from '../list-element-decorator'

@Component({
  selector: 'ds-wrapper-list-element',
  styleUrls: ['./wrapper-list-element.component.scss'],
  templateUrl: './wrapper-list-element.component.html'
})
export class WrapperListElementComponent implements OnInit {
  @Input() object: ListableObject;
  objectInjector: Injector;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.objectInjector = ReflectiveInjector.resolveAndCreate(
      [{provide: 'objectElementProvider', useFactory: () => ({ providedObject: this.object }) }], this.injector);

  }

  private getListElement(): string {
    return getListElementFor(this.object.constructor).constructor.name;
  }
}
