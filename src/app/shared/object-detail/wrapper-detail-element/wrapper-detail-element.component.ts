import { Component, Injector, Input, OnInit } from '@angular/core';

import { ViewMode } from '../../../core/shared/view-mode.model';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { rendersDSOType } from '../../object-collection/shared/dso-element-decorator';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { SetViewMode } from '../../view-mode';

/**
 * This component renders a wrapper for an object in the detail view.
 */
@Component({
  selector: 'ds-wrapper-detail-element',
  styleUrls: ['./wrapper-detail-element.component.scss'],
  templateUrl: './wrapper-detail-element.component.html'
})
export class WrapperDetailElementComponent implements OnInit {

  /**
   * The listable object.
   */
  @Input() object: ListableObject;

  /**
   * The instance of the injector.
   */
  objectInjector: Injector;

  detailElement: any;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   */
  constructor(private injector: Injector) {
  }

  /**
   * Initialize injector
   */
  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [{ provide: 'objectElementProvider', useFactory: () => (this.object), deps:[] }],
      parent: this.injector
    });
    this.detailElement = this.getDetailElement();
  }

  /**
   * Return class name for the object to inject
   */
  private getDetailElement(): string {
    const f: GenericConstructor<ListableObject> = this.object.constructor as GenericConstructor<ListableObject>;
    return rendersDSOType(f, SetViewMode.Detail);
  }
}
