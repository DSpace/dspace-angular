import { Inject, Injectable } from '@angular/core';

import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ErrorResponse, GenericSuccessResponse, RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceObject } from '../shared/dspace-object.model';
import { NormalizedDSpaceObject } from '../cache/models/normalized-dspace-object.model';

/**
 * A ResponseParsingService used to parse DSpaceRESTV2Response coming from the REST API to Browse Items (DSpaceObject[])
 */
@Injectable()
export class BrowseItemsResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = {
    getConstructor: () => DSpaceObject
  };
  protected toCache = false;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  /**
   * Parses data from the browse endpoint to a list of DSpaceObjects
   * @param {RestRequest} request
   * @param {DSpaceRESTV2Response} data
   * @returns {RestResponse}
   */
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._embedded)
      && Array.isArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]])) {
      const serializer = new DSpaceRESTv2Serializer(NormalizedDSpaceObject);
      const items = serializer.deserializeArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]]);
      return new GenericSuccessResponse(items, data.statusCode, data.statusText, this.processPageInfo(data.payload));
    } else if (hasValue(data.payload) && hasValue(data.payload.page)) {
      return new GenericSuccessResponse([], data.statusCode, data.statusText, this.processPageInfo(data.payload));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from browse endpoint'),
          { statusCode: data.statusCode, statusText: data.statusText }
        )
      );
    }
  }

}
