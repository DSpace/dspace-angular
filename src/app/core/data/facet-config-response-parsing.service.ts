import { Inject, Injectable } from '@angular/core';
import {
  FacetConfigSuccessResponse,
  RestResponse
} from '../cache/response.models';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { SearchFilterConfig } from '../../+search-page/search-service/search-filter-config.model';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';

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
    const serializer = new DSpaceRESTv2Serializer(SearchFilterConfig);
    const facetConfig = serializer.deserializeArray(config);
    return new FacetConfigSuccessResponse(facetConfig, data.statusCode, data.statusText);
  }
}
