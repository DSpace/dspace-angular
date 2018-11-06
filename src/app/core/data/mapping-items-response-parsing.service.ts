import { Inject, Injectable } from '@angular/core';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ErrorResponse, GenericSuccessResponse, RestResponse } from '../cache/response-cache.models';
import { isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { NormalizedItem } from '../cache/models/normalized-item.model';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { ObjectCacheService } from '../cache/object-cache.service';
import { BaseResponseParsingService } from './base-response-parsing.service';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Item } from '../shared/item.model';

@Injectable()
export class MappingItemsResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = NormalizedObjectFactory;
  protected toCache = true;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) { super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._embedded)
      && Array.isArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]])) {
      const serializer = new DSpaceRESTv2Serializer(DSpaceObject);
      const items = serializer.deserializeArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]]);
      return new GenericSuccessResponse(items, data.statusCode, this.processPageInfo(data.payload));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from mappingItems endpoint'),
          { statusText: data.statusCode }
        )
      );
    }
  }

}
