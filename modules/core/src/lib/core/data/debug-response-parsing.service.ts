import { Injectable } from '@angular/core';

import { RestResponse } from '../cache';
import { RawRestResponse } from '../dspace-rest';
import { ResponseParsingService } from './parsing.service';
import { RestRequest } from './rest-request.model';

@Injectable({ providedIn: 'root' })
export class DebugResponseParsingService implements ResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): RestResponse {
    console.log('request', request, 'data', data);
    return undefined;
  }
}
