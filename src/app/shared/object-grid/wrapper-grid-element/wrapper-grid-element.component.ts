import { Component, Injector, Input, OnInit } from '@angular/core';
import { SetViewMode } from '../../view-mode';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { rendersDSOType } from '../../object-collection/shared/dso-element-decorator';
import { ListableObject } from '../../object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-wrapper-grid-element',
  styleUrls: ['./wrapper-grid-element.component.scss'],
  templateUrl: './wrapper-grid-element.component.html'
})
export class WrapperGridElementComponent implements OnInit {
  @Input() object: ListableObject;
  objectInjector: Injector;
  gridElement: any;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [{ provide: 'objectElementProvider', useFactory: () => (this.object), deps:[] }],
      parent: this.injector
    });
    this.gridElement = this.getGridElement();
  }

  getGridElement(): string {
    const f: GenericConstructor<ListableObject> = this.object.constructor as GenericConstructor<ListableObject>;
    return rendersDSOType(f, SetViewMode.Grid);
  }
}
