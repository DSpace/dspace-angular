import { Inject, Injectable } from '@angular/core';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FacetValueMap, FacetValueMapSuccessResponse, FacetValueSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';

@Injectable()
export class FacetValueMapResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  objectFactory = {};
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
      const valuesResponse = new FacetValueSuccessResponse(facetValues, data.statusCode, this.processPageInfo(data.payload));
      facetMap[facet.name] = valuesResponse;
    });

    return new FacetValueMapSuccessResponse(facetMap, data.statusCode);
  }
}
