import { Injectable } from '@angular/core';
import { hasValue } from '@dspace/shared/utils';

import { ObjectCacheService } from '../cache';
import { Serializer } from '../serializer';
import {
  BROWSE_DEFINITION,
  BrowseDefinition,
  FLAT_BROWSE_DEFINITION,
  FlatBrowseDefinition,
  HIERARCHICAL_BROWSE_DEFINITION,
  HierarchicalBrowseDefinition,
  VALUE_LIST_BROWSE_DEFINITION,
  ValueListBrowseDefinition,
} from '../shared';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';

/**
 * A ResponseParsingService used to parse a REST API response to a BrowseDefinition object
 */
@Injectable({
  providedIn: 'root',
})
export class BrowseResponseParsingService extends DspaceRestResponseParsingService {
  constructor(
    protected objectCache: ObjectCacheService,
  ) {
    super(objectCache);
  }

  protected deserialize<ObjectDomain>(obj): any {
    const browseType: string = obj.browseType;
    if (obj.type === BROWSE_DEFINITION.value && hasValue(browseType)) {
      let serializer: Serializer<BrowseDefinition>;
      if (browseType === HIERARCHICAL_BROWSE_DEFINITION.value) {
        serializer = new this.serializerConstructor(HierarchicalBrowseDefinition);
      } else if (browseType === FLAT_BROWSE_DEFINITION.value) {
        serializer = new this.serializerConstructor(FlatBrowseDefinition);
      } else if (browseType === VALUE_LIST_BROWSE_DEFINITION.value) {
        serializer = new this.serializerConstructor(ValueListBrowseDefinition);
      } else {
        throw new Error('An error occurred while retrieving the browse definitions.');
      }
      return serializer.deserialize(obj);
    } else {
      throw new Error('An error occurred while retrieving the browse definitions.');
    }
  }
}
