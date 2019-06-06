import { Inject, Injectable } from '@angular/core';
import { RestRequest } from '../data/request.models';
import { ResponseParsingService } from '../data/parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  ErrorResponse,
  IntegrationSuccessResponse,
  RestResponse
} from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';
import { IntegrationObjectFactory } from './integration-object-factory';

import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IntegrationModel } from './models/integration.model';
import { IntegrationType } from './intergration-type';
import { AuthorityValue } from './models/authority.value';
import { PaginatedList } from '../data/paginated-list';

@Injectable()
export class IntegrationResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected objectFactory = IntegrationObjectFactory;
  protected toCache = true;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      const dataDefinition = this.process<IntegrationModel,IntegrationType>(data.payload, request.uuid);
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
      if (item.type === IntegrationType.Authority) {
        data.page[index] = Object.assign(new AuthorityValue(), item);
      }
    });

    return data;
  }

}
