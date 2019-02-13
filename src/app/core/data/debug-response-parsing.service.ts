import { Injectable } from '@angular/core';
import { RestResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './request.models';

@Injectable()
export class DebugResponseParsingService implements ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse {
    console.log('request', request, 'data', data);
    return undefined;
  }
}
