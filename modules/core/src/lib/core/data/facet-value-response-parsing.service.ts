import { Injectable } from '@angular/core';

import { ParsedResponse } from '../cache';
import {
  DSpaceSerializer,
  RawRestResponse,
} from '../dspace-rest';
import {
  FacetValue,
  FacetValues,
} from '../shared';
import { DspaceRestResponseParsingService } from './dspace-rest-response-parsing.service';
import { RestRequest } from './rest-request.model';

@Injectable({ providedIn: 'root' })
export class FacetValueResponseParsingService extends DspaceRestResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse {
    const payload = data.payload;
    const facetValues = new DSpaceSerializer(FacetValues).deserialize(payload);
    facetValues.pageInfo = this.processPageInfo(payload);
    facetValues.page = new DSpaceSerializer(FacetValue).deserializeArray(payload._embedded.values);
    this.addToObjectCache(facetValues, request, data);
    return new ParsedResponse(data.statusCode, facetValues._links.self);
  }
}
