import { Injectable } from '@angular/core';
import { RestResponse, SearchSuccessResponse } from '../cache/response.models';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { hasValue } from '../../shared/empty.util';
import { SearchQueryResponse } from '../../shared/search/search-query-response.model';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';

@Injectable()
export class MyDSpaceResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    // fallback for unexpected empty response
    const emptyPayload = {
      _embedded: {
        objects: []
      }
    };
    const payload = data.payload._embedded.searchResult || emptyPayload;
    const hitHighlights: MetadataMap[] = payload._embedded.objects
      .map((object) => object.hitHighlights)
      .map((hhObject) => {
        const mdMap: MetadataMap = {};
        if (hhObject) {
          for (const key of Object.keys(hhObject)) {
            const value: MetadataValue = Object.assign(new MetadataValue(), {
              value: hhObject[key].join('...'),
              language: null
            });
            mdMap[key] = [value];
          }
        }
        return mdMap;
      });

    const dsoSelfLinks = payload._embedded.objects
      .filter((object) => hasValue(object._embedded))
      .map((object) => object._embedded.indexableObject)
      .map((dso) => this.dsoParser.parse(request, {
        payload: dso,
        statusCode: data.statusCode,
        statusText: data.statusText
      }))
      .map((obj) => obj.resourceSelfLinks)
      .reduce((combined, thisElement) => [...combined, ...thisElement], []);

    const objects = payload._embedded.objects
      .filter((object) => hasValue(object._embedded))
      .map((object, index) => Object.assign({}, object, {
        indexableObject: dsoSelfLinks[index],
        hitHighlights: hitHighlights[index],
        _embedded: this.filterEmbeddedObjects(object)
      }));
    payload.objects = objects;
    const deserialized = new DSpaceSerializer(SearchQueryResponse).deserialize(payload);
    return new SearchSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(payload));
  }

  protected filterEmbeddedObjects(object) {
    const allowedEmbeddedKeys = ['submitter', 'item', 'workspaceitem', 'workflowitem'];
    if (object._embedded.indexableObject && object._embedded.indexableObject._embedded) {
      return Object.assign({}, object._embedded, {
        indexableObject: Object.assign({}, object._embedded.indexableObject, {
          _embedded: Object.keys(object._embedded.indexableObject._embedded)
            .filter((key) => allowedEmbeddedKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = object._embedded.indexableObject._embedded[key];
              return obj;
            }, {})
        })
      });
    } else {
      return object;
    }

  }
}
