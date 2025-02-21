import { ResponseParsingService } from '@dspace/core';
import { PostRequest } from '@dspace/core';
import { StatusCodeOnlyResponseParsingService } from '@dspace/core';
import { GenericConstructor } from '@dspace/core';

export class TrackRequest extends PostRequest {

  getResponseParser(): GenericConstructor<ResponseParsingService> {
    return StatusCodeOnlyResponseParsingService;
  }
}
