import { Component, Input, Injector, ReflectiveInjector, OnInit } from '@angular/core';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { getGridElementFor } from '../grid-element-decorator';
import { ListableObject } from '../../object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-wrapper-grid-element',
  styleUrls: ['./wrapper-grid-element.component.scss'],
  templateUrl: './wrapper-grid-element.component.html'
})
export class WrapperGridElementComponent implements OnInit {
  @Input() object: ListableObject;
  objectInjector: Injector;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.objectInjector = ReflectiveInjector.resolveAndCreate(
      [{provide: 'objectElementProvider', useFactory: () => (this.object) }], this.injector);

  }

  getGridElement(): string {
    const f: GenericConstructor<ListableObject> = this.object.constructor as GenericConstructor<ListableObject>;
    return getGridElementFor(f);
  }
}
