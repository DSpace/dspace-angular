import { Injectable } from '@angular/core';
import { isNotEmpty } from '@dspace/shared/utils';

import {
  RestResponse,
  TokenResponse,
} from '../cache';
import {
  ResponseParsingService,
  RestRequest,
} from '../data';
import { RawRestResponse } from '../dspace-rest';

@Injectable({ providedIn: 'root' })
/**
 * A ResponseParsingService used to parse RawRestResponse coming from the REST API to a token string
 * wrapped in a TokenResponse
 */
export class TokenResponseParsingService implements ResponseParsingService {

  parse(request: RestRequest, data: RawRestResponse): RestResponse {
    if (isNotEmpty(data.payload) && isNotEmpty(data.payload.token) && (data.statusCode === 200)) {
      return new TokenResponse(data.payload.token, true, data.statusCode, data.statusText);
    } else {
      return new TokenResponse(null, false, data.statusCode, data.statusText);
    }
  }

}
