import { RawRestResponse } from '../dspace-rest/raw-rest-response.model';
import { RestRequest } from './request.models';
import { ParsedResponse } from '../cache/response.models';

export interface ResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse;
}
