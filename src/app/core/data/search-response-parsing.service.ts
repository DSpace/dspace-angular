import { Injectable } from '@angular/core';
import { hasValue } from '../../shared/empty.util';
import { SearchQueryResponse } from '../../shared/search/search-query-response.model';
import { RestResponse, SearchSuccessResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class SearchResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    // fallback for unexpected empty response
    const emptyPayload = {
      _embedded : {
        objects: []
      }
    };
    const payload = data.payload._embedded.searchResult || emptyPayload;
    payload.appliedFilters = data.payload.appliedFilters;
    payload.sort = data.payload.sort;
    payload.scope = data.payload.scope;
    payload.configuration = data.payload.configuration;
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
      }));
    payload.objects = objects;
    const deserialized = new DSpaceSerializer(SearchQueryResponse).deserialize(payload);
    return new SearchSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(payload));
  }
}
