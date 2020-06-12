import { Input } from '@angular/core';

/**
 * This class defines the basic model to extends for create a new
 * field render component
 */
export class RenderingTypeModel {

  @Input() item;
  @Input() field;

  getMetadatavalue(key: string): any {
    return key ? this.item.firstMetadataValue(key) : '';
  }
}
