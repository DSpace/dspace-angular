import { Injectable } from '@angular/core';

import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ConfigSuccessResponse, ErrorResponse, RestResponse } from '../cache/response-cache.models';
import { isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { ConfigObjectFactory } from '../shared/config/config-object-factory';

@Injectable()
export class ConfigResponseParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload._links)) {
      let configDefinition;
      let payload;
      let type;
      if (isNotEmpty(data.payload._embedded) && Array.isArray(data.payload._embedded[Object.keys(data.payload._embedded)[0]])) {
        type = Object.keys(data.payload._embedded)[0];
        payload = data.payload._embedded[Object.keys(data.payload._embedded)[0]];
      } else {
        type = data.payload.type;
        payload = [data.payload];
      }
      const serializer = new DSpaceRESTv2Serializer(ConfigObjectFactory.getConstructor(type));
      configDefinition = serializer.deserializeArray(payload);
      return new ConfigSuccessResponse(configDefinition, data.statusCode);
    } else {
      return new ErrorResponse(
        Object.assign(
          new Error('Unexpected response from config endpoint'),
          {statusText: data.statusCode}
        )
      );
    }
  }
}
