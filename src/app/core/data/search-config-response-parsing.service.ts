import { Injectable } from '@angular/core';
import { SearchFilterConfig } from '../../shared/search/search-filter-config.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { FacetConfigSuccessResponse, RestResponse, SearchConfigSuccessResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceSerializer } from '../dspace-rest-v2/dspace.serializer';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { SearchConfig } from 'src/app/shared/search/search-filters/search-config.model';

@Injectable()
export class SearchConfigResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  toCache = false;
  constructor(
    protected objectCache: ObjectCacheService,
  ) { super();
  }
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    return new SearchConfigSuccessResponse(data.payload as SearchConfig, data.statusCode, data.statusText);
  }
}
