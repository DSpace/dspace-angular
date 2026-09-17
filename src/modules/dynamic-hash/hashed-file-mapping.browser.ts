/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
  Optional,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils/empty.util';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';

import {
  HashedFileMapping,
  ID,
} from './hashed-file-mapping';

/**
 * Client-side implementation of {@link HashedFileMapping}.
 * Reads out the mapping from index.html before the app is bootstrapped.
 * Afterwards, {@link resolve} can be used to grab the latest file.
 */
@Injectable()
export class BrowserHashedFileMapping extends HashedFileMapping {
  constructor(
    @Optional() @Inject(DOCUMENT) protected document: any,
  ) {
    super();
    const element = document?.querySelector(`script#${ID}`);

    if (hasValue(element?.textContent)) {
      const mapping = JSON.parse(element.textContent);

      if (isObject(mapping)) {
        Object.entries(mapping)
          .filter(([key, value]) => isString(key) && isString(value))
          .forEach(([plainPath, hashPath]) => this.map.set(plainPath, hashPath));
      }
    }
  }
}
