import { Component, Input } from '@angular/core';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { isEmpty } from '../../empty.util';

@Component({
  selector: 'ds-type-badge',
  templateUrl: './type-badge.component.html'
})
/**
 * Component rendering the type of an item as a badge
 */
export class TypeBadgeComponent {

  private _object: DSpaceObject;
  private _typeMessage: string;

  /**
   * The component used to retrieve the type from
   */
  @Input() set object(object: DSpaceObject) {
    this._object = object;

    const renderTypes = this._object.getRenderTypes();
    if (!isEmpty(renderTypes.length)) {
      const renderType = renderTypes[0];
      if (renderType instanceof Function) {
        this._typeMessage = `${(renderType as any).name.toLowerCase()}.listelement.badge`;
      } else {
        this._typeMessage = `${renderType.toLowerCase()}.listelement.badge`;
      }
    }
  }

  get object(): DSpaceObject {
    return this._object;
  }

  get typeMessage(): string {
    return this._typeMessage;
  }
}
