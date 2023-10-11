import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Item } from '../../shared/item.model';
import { getSchemaJsonLDProviderByEntity, getSchemaJsonLDProviderByType } from './schema-types/schema-type-decorator';
import { GenericConstructor } from '../../shared/generic-constructor';
import { SchemaType } from './schema-types/schema-type';
import { isEmpty, isNotEmpty } from '../../../shared/empty.util';

@Injectable()
export class SchemaJsonLDService {
  static scriptType = 'application/ld+json';

  constructor(@Inject(DOCUMENT) private _document: Document) {}

  removeStructuredData(): void {
    const els = [];
    [ 'structured-data', 'structured-data-org' ].forEach(c => {
      els.push(...Array.from(this._document.head.getElementsByClassName(c)));
    });
    els.forEach(el => this._document.head.removeChild(el));
  }

  insertSchema(item: Item, className = 'structured-data'): void {
    const schema = this.getSchemaByEntityType(item);
    if (isNotEmpty(schema)) {
      let script;
      let shouldAppend = false;
      if (this._document.head.getElementsByClassName(className).length) {
        script = this._document.head.getElementsByClassName(className)[0];
      } else {
        script = this._document.createElement('script');
        shouldAppend = true;
      }
      script.setAttribute('class', className);
      script.type = SchemaJsonLDService.scriptType;
      script.text = JSON.stringify(schema);
      if (shouldAppend) {
        this._document.head.appendChild(script);
      }
    }
  }

  private getSchemaByEntityType(item: Item): Record<string, any> {
    const entityType = item.entityType;
    let dcType = item.firstMetadataValue('dc.type');
    const parts = dcType?.split('::');
    if (Array.isArray(parts) && isNotEmpty(parts) ) {
      if (parts.length > 1) {
        dcType = parts[parts.length - 1];
      }
    }
    let constructor: GenericConstructor<SchemaType> = getSchemaJsonLDProviderByType(entityType, dcType);
    // if schema related to type is not available search for entity generic one
    if (isEmpty(constructor)) {
      constructor = getSchemaJsonLDProviderByEntity(entityType);
    }

    if (isNotEmpty(constructor)) {
      const provider: SchemaType = new constructor();
      return provider.getSchema(item);
    } else {
      return null;
    }

  }
}
