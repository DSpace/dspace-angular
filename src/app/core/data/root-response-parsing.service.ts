import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { ErrorResponse, RestResponse, RootSuccessResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { isNotEmpty } from '../../shared/empty.util';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';

@Injectable()
export class RootResponseParsingService implements ResponseParsingService {
  constructor(
    @Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig,
  ) {
  }

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      const links = data.payload._links;
      for (const link of Object.keys(links)) {
        let href = links[link].href;
        // TODO temporary workaround as these endpoint paths are relative, but should be absolute
        if (isNotEmpty(href) && !href.startsWith('http')) {
          href = new RESTURLCombiner(this.EnvConfig, href.substring(this.EnvConfig.rest.nameSpace.length)).toString();
        }
        links[link] = href;
      }
      return new RootSuccessResponse(links, data.statusCode);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from root endpoint'),
          { statusText: data.statusCode }
        )
      );
    }
  }
}
