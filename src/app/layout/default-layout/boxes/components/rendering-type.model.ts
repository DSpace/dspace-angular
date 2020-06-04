import { Input } from '@angular/core';

export class RenderingTypeModel {

  @Input() item;
  @Input() field;

  getMetadatavalue(key: string): any {
    return key ? this.item.firstMetadataValue(key) : '';
  }
}
