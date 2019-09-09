import { Component, Injector, Input, OnInit } from '@angular/core';
import { SetViewMode } from '../../view-mode';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { rendersDSOType } from '../../object-collection/shared/dso-element-decorator'
import { ListableObject } from '../../object-collection/shared/listable-object.model';

@Component({
  selector: 'ds-wrapper-list-element',
  styleUrls: ['./wrapper-list-element.component.scss'],
  templateUrl: './wrapper-list-element.component.html'
})
export class WrapperListElementComponent implements OnInit {
  @Input() object: ListableObject;
  @Input() index: number;
  objectInjector: Injector;
  listElement: any;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.objectInjector = Injector.create({
        providers: [
          { provide: 'objectElementProvider', useFactory: () => (this.object), deps:[] },
          { provide: 'indexElementProvider', useFactory: () => (this.index), deps:[] }
        ],
        parent: this.injector
    });
    this.listElement = this.getListElement();
  }

  private getListElement(): string {
    const f: GenericConstructor<ListableObject> = this.object.constructor as GenericConstructor<ListableObject>;
    return rendersDSOType(f, SetViewMode.List);
  }
}
