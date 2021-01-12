import { Injectable } from '@angular/core';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RestResponse, SearchConfigSuccessResponse } from '../cache/response.models';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { SearchConfig } from 'src/app/shared/search/search-filters/search-config.model';
import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';

@Injectable()
export class SearchConfigResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {
  toCache = false;
  constructor(
    protected objectCache: ObjectCacheService,
  ) { super();
  }
  parse(request: RestRequest, data: RawRestResponse): RestResponse {
    return new SearchConfigSuccessResponse(data.payload as SearchConfig, data.statusCode, data.statusText);
  }
}
