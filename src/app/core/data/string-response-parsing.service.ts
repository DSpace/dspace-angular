import { Injectable } from '@angular/core';
import {RestResponse, StringResponse} from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

/**
 * A responseparser that will parse the response body to a string.
 */
@Injectable()
export class StringResponseParsingService implements ResponseParsingService {

  /**
   * Parse the response to a string.
   *
   * @param request The request that was sent to the server
   * @param data The response to parse
   */
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    const isSuccessful = data.statusCode >= 200 && data.statusCode < 300;
    return new StringResponse(isSuccessful, data.statusCode, data.statusText, data.payload as undefined as string);
  }
}
