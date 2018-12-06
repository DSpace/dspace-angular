import { RestRequest } from './request.models';
import { RestResponse } from '../cache/response-cache.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';

export interface ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse;
}
