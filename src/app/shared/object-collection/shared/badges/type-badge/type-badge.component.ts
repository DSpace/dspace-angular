import { NgIf } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { getResourceTypeValueFor } from '../../../../../core/cache/object-cache.reducer';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import {
  hasValue,
  isEmpty,
} from '../../../../empty.util';

@Component({
  selector: 'ds-type-badge',
  templateUrl: './type-badge.component.html',
  standalone: true,
  imports: [NgIf, TranslateModule],
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
        const resourceTypeValue = getResourceTypeValueFor(object.type);
        if (hasValue(resourceTypeValue)) {
          this._typeMessage = `${resourceTypeValue.toLowerCase()}.listelement.badge`;
        } else {
          this._typeMessage = `${renderType.name.toLowerCase()}.listelement.badge`;
        }
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
