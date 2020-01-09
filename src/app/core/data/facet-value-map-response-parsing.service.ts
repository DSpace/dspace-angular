import { Inject, Injectable } from '@angular/core';
import {
  FacetValueMap,
  FacetValueMapSuccessResponse,
  FacetValueSuccessResponse,
  RestResponse
} from '../cache/response.models';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { FacetValue } from '../../shared/search/facet-value.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';

@Injectable()
export class FacetValueMapResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  toCache = false;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {

    const payload = data.payload;
    const facetMap: FacetValueMap = new FacetValueMap();

    const serializer = new DSpaceRESTv2Serializer(FacetValue);
    payload._embedded.facets.map((facet) => {
      const values = facet._embedded.values.map((value) => {value.search = value._links.search.href; return value;});
      const facetValues = serializer.deserializeArray(values);
      const valuesResponse = new FacetValueSuccessResponse(facetValues, data.statusCode, data.statusText, this.processPageInfo(data.payload));
      facetMap[facet.name] = valuesResponse;
    });

    return new FacetValueMapSuccessResponse(facetMap, data.statusCode, data.statusText);
  }
}
