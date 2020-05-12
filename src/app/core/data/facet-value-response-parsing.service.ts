import { Inject, Injectable } from '@angular/core';
import { FacetValue } from '../../shared/search/facet-value.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FacetValueSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class FacetValueResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  toCache = false;
  constructor(
    protected objectCache: ObjectCacheService,
  ) { super();
  }
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const serializer = new DSpaceSerializer(FacetValue);
    // const values = payload._embedded.values.map((value) => {value.search = value._links.search.href; return value;});

    const facetValues = serializer.deserializeArray(payload._embedded.values);
    return new FacetValueSuccessResponse(facetValues, data.statusCode, data.statusText, this.processPageInfo(data.payload));
  }
}
