import { Injectable } from '@angular/core';

import { hasValue } from '../../shared/empty.util';
import {
  MetadataValue,
  VIRTUAL_METADATA_PREFIX,
} from '../shared/metadata.models';

/**
 * Service for working with DSpace object metadata.
 */
@Injectable({
  providedIn: 'root',
})
export class MetadataService {

  /**
   * Returns true if this Metadata authority key starts with 'virtual::'
   */
  public isVirtual(metadataValue: MetadataValue | undefined): boolean {
    return hasValue(metadataValue?.authority) && metadataValue.authority.startsWith(VIRTUAL_METADATA_PREFIX);
  }

  /**
   * If this is a virtual Metadata, it returns everything in the authority key after 'virtual::'.
   *
   * Returns undefined otherwise.
   */
  public virtualValue(metadataValue: MetadataValue | undefined): string {
    if (this.isVirtual(metadataValue)) {
      return metadataValue.authority.substring(metadataValue.authority.indexOf(VIRTUAL_METADATA_PREFIX) + VIRTUAL_METADATA_PREFIX.length);
    } else {
      return undefined;
    }
  }

}
