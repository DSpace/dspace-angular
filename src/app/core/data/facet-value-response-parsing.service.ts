import { Inject, Injectable } from '@angular/core';
import { FacetValueSuccessResponse, RestResponse } from '../cache/response.models';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { FacetValue } from '../../+search-page/search-service/facet-value.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';

@Injectable()
export class FacetValueResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  toCache = false;
  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const payload = data.payload;

    const serializer = new DSpaceRESTv2Serializer(FacetValue);
    // const values = payload._embedded.values.map((value) => {value.search = value._links.search.href; return value;});

    const facetValues = serializer.deserializeArray(payload._embedded.values);
    return new FacetValueSuccessResponse(facetValues, data.statusCode, data.statusText, this.processPageInfo(data.payload));
  }
}
