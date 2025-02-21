import { ParsedResponse } from '../cache';
import { RawRestResponse } from '../dspace-rest';
import { RestRequest } from './rest-request.model';

export interface ResponseParsingService {
  parse(request: RestRequest, data: RawRestResponse): ParsedResponse;
}
