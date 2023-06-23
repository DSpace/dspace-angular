import { Injectable } from '@angular/core';
import { ObjectCacheService } from '../cache/object-cache.service';
import { hasValue } from '../../shared/empty.util';
import {
  HIERARCHICAL_BROWSE_DEFINITION
} from '../shared/hierarchical-browse-definition.resource-type';
import { FLAT_BROWSE_DEFINITION } from '../shared/flat-browse-definition.resource-type';
import { HierarchicalBrowseDefinition } from '../shared/hierarchical-browse-definition.model';
import { FlatBrowseDefinition } from '../shared/flat-browse-definition.model';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import { Serializer } from '../serializer';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BROWSE_DEFINITION } from '../shared/browse-definition.resource-type';
import { ValueListBrowseDefinition } from '../shared/value-list-browse-definition.model';
import { VALUE_LIST_BROWSE_DEFINITION } from '../shared/value-list-browse-definition.resource-type';

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
