import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { SearchFilterConfig } from '../../shared/search/search-filter-config.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FacetConfigSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class FacetConfigResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  toCache = false;
  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {

    const config = data.payload._embedded.facets;
    const serializer = new DSpaceSerializer(SearchFilterConfig);
    const facetConfig = serializer.deserializeArray(config);
    return new FacetConfigSuccessResponse(facetConfig, data.statusCode, data.statusText);
  }
}
