import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { RestRequest } from './request.models';
import { RestResponse } from '../cache/response.models';

export interface ResponseParsingService {
  parse(request: RestRequest, data: DSpaceRESTV2Response): RestResponse;
}
