import isObject from 'lodash/isObject';

import { Item } from '../../../shared/item.model';
import { isNotEmpty } from '../../../../shared/empty.util';

export abstract class SchemaType {
  protected abstract createSchema(item: Item): Record<string, any>;
  protected abstract createSchema(item: Item): Record<string, any>;

  static getMetadataValue(item: Item, metadataName:  string): string|string[] {
    const values = item.allMetadataValues(metadataName);
    if (isNotEmpty(values)) {
      return values.length > 1 ? values : values[0];
    } else {
      return null;
    }
  }

  static removeEmpty(obj) {
    if (Array.isArray(obj)) {
      return obj
        .filter((v) => isNotEmpty(v))
        .map((v)  => isObject(v) ? SchemaType.removeEmpty(v) : v);
    } else {
      return Object.entries(obj)
        .filter(([_, v]) => isNotEmpty(v))
        .reduce(
          (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? SchemaType.removeEmpty(v) : v }),
          {}
        );
    }
  }

  getSchema(item: Item): Record<string, any> {
    return SchemaType.removeEmpty(this.createSchema(item));
  }
}
