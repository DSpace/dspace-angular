import { Inject, Injectable } from '@angular/core';

import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FacetConfigSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';

@Injectable()
export class FacetConfigResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  objectFactory = {};
  toCache = false;
  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {

    const config = data.payload._embedded.facets;
    const serializer = new DSpaceRESTv2Serializer(SearchFilterConfig);
    const facetConfig = serializer.deserializeArray(config);
    return new FacetConfigSuccessResponse(facetConfig, data.statusCode);
  }
}
