import { Injectable } from '@angular/core';

import { hasValue } from '../../shared/empty.util';
import { SearchObjects } from '../../shared/search/models/search-objects.model';
import { getClassForType } from '../cache/builders/build-decorators';
import { ParsedResponse } from '../cache/response.models';
import { DSpaceSerializer } from '../dspace-rest/dspace.serializer';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import {
  MetadataMap,
  MetadataValue,
} from '../shared/metadata.models';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import { RestRequest } from './rest-request.model';

@Injectable({ providedIn: 'root' })
export class SearchResponseParsingService extends DspaceRestResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse {
    // fallback for unexpected empty response
    const emptyPayload = {
      _embedded : {
        objects: [],
      },
    };
    const payload: any = data.payload || emptyPayload;
    const hitHighlights: MetadataMap[] = payload._embedded.objects
      .map((object) => object.hitHighlights)
      .map((hhObject) => {
        const mdMap: MetadataMap = {};
        if (hhObject) {
          for (const key of Object.keys(hhObject)) {
            const value: MetadataValue = Object.assign(new MetadataValue(), { value: hhObject[key].join('...'), language: null });
            mdMap[key] = [ value ];
          }
        }
        return mdMap;
      });

    const objects = payload._embedded.objects
      .filter((object) => hasValue(object._embedded))
      .map((object, index) => Object.assign({}, object, {
        indexableObject: object._embedded.indexableObject,
        hitHighlights: hitHighlights[index],
      }));
    payload.objects = objects;
    const deserialized: SearchObjects<any> = new DSpaceSerializer(SearchObjects).deserialize(payload);
    deserialized.page.forEach((result) => {
      result.indexableObject = new DSpaceSerializer(getClassForType(result.indexableObject.type)).deserialize(result.indexableObject);
    });
    deserialized.pageInfo = this.processPageInfo(payload);
    this.addToObjectCache(deserialized, request, data);
    return new ParsedResponse(data.statusCode, deserialized._links.self);
  }
}
