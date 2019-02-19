import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ErrorResponse, RestResponse, EndpointMapSuccessResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { isNotEmpty } from '../../shared/empty.util';

@Injectable()
export class EndpointMapResponseParsingService implements ResponseParsingService {
  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
  ) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      const links = data.payload._links;
      for (const link of Object.keys(links)) {
        links[link] = links[link].href;
      }
      return new EndpointMapSuccessResponse(links, data.statusCode, data.statusText);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from root endpoint'),
          { statusCode: data.statusCode, statusText: data.statusText }
        )
      );
    }
  }
}
