import { Injectable } from '@angular/core';
import { ObjectCacheService } from '../cache/object-cache.service';
import { hasValue } from '../../shared/empty.util';
import { HIERARCHICAL_BROWSE_DEFINITION } from '../shared/hierarchical-browse-definition.resource-type';
import { FLAT_BROWSE_DEFINITION } from '../shared/flat-browse-definition.resource-type';
import { HierarchicalBrowseDefinition } from '../shared/hierarchical-browse-definition.model';
import { FlatBrowseDefinition } from '../shared/flat-browse-definition.model';
import { DSOResponseParsingService } from './dso-response-parsing.service';

/**
 * A ResponseParsingService used to parse RawRestResponse coming from the REST API to a BrowseDefinition object
 */
@Injectable({
    providedIn: 'root',
  })
export class BrowseResponseParsingService extends DSOResponseParsingService {
  protected objectCache: ObjectCacheService;
  protected toCache: boolean;

  protected deserialize<ObjectDomain>(obj): any {
    const browseType: string = obj.browseType;
    if (hasValue(browseType)) {
      if (browseType === HIERARCHICAL_BROWSE_DEFINITION.value) {
        const serializer = new this.serializerConstructor(HierarchicalBrowseDefinition);
        return serializer.deserialize(obj);
      } else if (browseType === FLAT_BROWSE_DEFINITION.value) {
        const serializer = new this.serializerConstructor(FlatBrowseDefinition);
        return serializer.deserialize(obj);
      }
    } else {
      console.warn('cannot deserialize type ' + browseType);
      return null;
    }
  }
}
