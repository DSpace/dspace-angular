import { Injectable } from '@angular/core';

import { ParsedResponse } from '../cache';
import {
  DSpaceSerializer,
  RawRestResponse,
} from '../dspace-rest';
import {
  FacetConfigResponse,
  SearchFilterConfig,
} from '../shared';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import { RestRequest } from './rest-request.model';

@Injectable({ providedIn: 'root' })
export class FacetConfigResponseParsingService extends DspaceRestResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse {

    const config = data.payload._embedded.facets;
    const serializer = new DSpaceSerializer(SearchFilterConfig);
    const filters = serializer.deserializeArray(config);

    const _links = {
      self: data.payload._links.self,
    };

    // fill in the missing links section
    filters.forEach((filterConfig: SearchFilterConfig) => {
      _links[filterConfig.name] = {
        href: filterConfig._links.self.href,
      };
    });

    const facetConfigResponse = Object.assign(new FacetConfigResponse(), {
      filters,
      _links,
    });

    this.addToObjectCache(facetConfigResponse, request, data);

    return new ParsedResponse(data.statusCode, facetConfigResponse._links.self);
  }
}
