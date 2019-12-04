import { Injectable } from '@angular/core';
import { RestResponse, SearchSuccessResponse } from '../cache/response.models';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { hasValue } from '../../shared/empty.util';
import { SearchQueryResponse } from '../../+search-page/search-service/search-query-response.model';
import { MetadataMap, MetadataValue } from '../shared/metadata.models';

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
      // we don't need embedded collections, bitstreamformats, etc for search results.
      // And parsing them all takes up a lot of time. Throw them away to improve performance
      // until objs until partial results are supported by the rest api
      .map((dso) => Object.assign({}, dso, { _embedded: undefined }))
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
        // we don't need embedded collections, bitstreamformats, etc for search results.
        // And parsing them all takes up a lot of time. Throw them away to improve performance
        // until objs until partial results are supported by the rest api
        _embedded: undefined
      }));
    payload.objects = objects;
    const deserialized = new DSpaceRESTv2Serializer(SearchQueryResponse).deserialize(payload);
    return new SearchSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(payload));
  }
}
