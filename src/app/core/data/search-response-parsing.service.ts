import { Injectable } from '@angular/core';
import { RestResponse, SearchSuccessResponse } from '../cache/response-cache.models';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { hasValue } from '../../shared/empty.util';
import { SearchQueryResponse } from '../../+search-page/search-service/search-query-response.model';
import { Metadatum } from '../shared/metadatum.model';

@Injectable()
export class SearchResponseParsingService implements ResponseParsingService {
  constructor(private dsoParser: DSOResponseParsingService) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload._embedded.searchResult;
    const hitHighlights = payload._embedded.objects
      .map((object) => object.hitHighlights)
      .map((hhObject) => {
        if (hhObject) {
          return Object.keys(hhObject).map((key) => Object.assign(new Metadatum(), {
            key: key,
            value: hhObject[key].join('...')
          }))
        } else {
          return [];
        }
      });

    const dsoSelfLinks = payload._embedded.objects
      .filter((object) => hasValue(object._embedded))
      .map((object) => object._embedded.dspaceObject)
      // we don't need embedded collections, bitstreamformats, etc for search results.
      // And parsing them all takes up a lot of time. Throw them away to improve performance
      // until objs until partial results are supported by the rest api
      .map((dso) => Object.assign({}, dso, { _embedded: undefined }))
      .map((dso) => this.dsoParser.parse(request, {
        payload: dso,
        statusCode: data.statusCode
      }))
      .map((obj) => obj.resourceSelfLinks)
      .reduce((combined, thisElement) => [...combined, ...thisElement], []);

    const objects = payload._embedded.objects
      .filter((object) => hasValue(object._embedded))
      .map((object, index) => Object.assign({}, object, {
        dspaceObject: dsoSelfLinks[index],
        hitHighlights: hitHighlights[index],
        // we don't need embedded collections, bitstreamformats, etc for search results.
        // And parsing them all takes up a lot of time. Throw them away to improve performance
        // until objs until partial results are supported by the rest api
        _embedded: undefined
      }));
    payload.objects = objects;
    const deserialized = new DSpaceRESTv2Serializer(SearchQueryResponse).deserialize(payload);
    return new SearchSuccessResponse(deserialized, data.statusCode, this.dsoParser.processPageInfo(payload));
  }
}
