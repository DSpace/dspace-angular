import { Inject, Injectable } from '@angular/core';
import { RestRequest } from '../data/request.models';
import { ResponseParsingService } from '../data/parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ErrorResponse, IntegrationSuccessResponse, RestResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';

import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IntegrationModel } from './models/integration.model';
import { AuthorityValue } from './models/authority.value';
import { PaginatedList } from '../data/paginated-list';

@Injectable()
export class IntegrationResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected toCache = true;

  constructor(
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      const dataDefinition = this.process<IntegrationModel>(data.payload, request);
      return new IntegrationSuccessResponse(this.processResponse(dataDefinition), data.statusCode, data.statusText, this.processPageInfo(data.payload));
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from Integration endpoint'),
          {statusCode: data.statusCode, statusText: data.statusText}
        )
      );
    }
  }

  protected processResponse(data: PaginatedList<IntegrationModel>): any {
    const returnList = Array.of();
    data.page.forEach((item, index) => {
      if (item.type === AuthorityValue.type.value) {
        data.page[index] = Object.assign(new AuthorityValue(), item);
      }
    });

    return data;
  }

}
