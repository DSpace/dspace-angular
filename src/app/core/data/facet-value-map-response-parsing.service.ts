import { Injectable } from '@angular/core';
import { FacetValue } from '../../shared/search/facet-value.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FacetValueMap, FacetValueMapSuccessResponse, FacetValueSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class FacetValueMapResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  toCache = false;

  constructor(
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {

    const payload = data.payload;
    const facetMap: FacetValueMap = new FacetValueMap();

    const serializer = new DSpaceSerializer(FacetValue);
    payload._embedded.facets.map((facet) => {
      const values = facet._embedded.values.map((value) => {value.search = value._links.search.href; return value;});
      const facetValues = serializer.deserializeArray(values);
      const valuesResponse = new FacetValueSuccessResponse(facetValues, data.statusCode, data.statusText, this.processPageInfo(data.payload));
      facetMap[facet.name] = valuesResponse;
    });

    return new FacetValueMapSuccessResponse(facetMap, data.statusCode, data.statusText);
  }
}
