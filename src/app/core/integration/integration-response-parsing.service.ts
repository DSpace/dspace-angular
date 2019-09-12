import { Inject, Injectable } from '@angular/core';
import { RestRequest } from '../data/request.models';
import { ResponseParsingService } from '../data/parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ErrorResponse, IntegrationSuccessResponse, RestResponse } from '../cache/response.models';
import { isNotEmpty } from '../../shared/empty.util';

import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IntegrationModel } from './models/integration.model';
import { AuthorityEntry } from './models/authority-entry.model';
import { PaginatedList } from '../data/paginated-list';

@Injectable()
export class IntegrationResponseParsingService extends BaseResponseParsingService implements ResponseParsingService {

  protected toCache = true;

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    protected objectCache: ObjectCacheService,
  ) {
    super();
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (this.isSuccessStatus(data.statusCode)) {
      const dataDefinition = this.process<IntegrationModel>(data.payload, request.uuid);
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
    if (isNotEmpty(data)) {
      data.page.forEach((item, index) => {
        if (item.type === AuthorityEntry.type.value) {
          data.page[index] = Object.assign(new AuthorityEntry(), item);
        }
      });
    }

    return data;
  }

}
